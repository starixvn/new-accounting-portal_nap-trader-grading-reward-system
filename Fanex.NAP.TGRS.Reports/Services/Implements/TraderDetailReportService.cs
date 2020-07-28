// --------------------------------------------------------------------------
// <copyright file="TraderDetailReportService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.9">Created</change>
//   <change who="Ken.Nguyen" date="2014.6.13">Add Excel export</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.Data.Repository;
    using Fanex.NAP.Core.Web;    
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.ExcelUtility;
    using Fanex.NAP.TGRS.Core.ExcelUtility.RichTextExtensions;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;
    using NPOI.SS.UserModel;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;

    /// <summary>
    /// Detail report service.
    /// </summary>
    public partial class DetailReportService : TGRSBaseService, IDetailReportService
    {
        private const string TraderPerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.Reports.TraderPerformance";

        public Func<string, Fanex.NAP.Core.Business.Constant.Policy, bool> PermissionCheck { get; set; }

        /// <summary>
        /// Gets the trader performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>TraderPerformanceList object.</returns>
        public TraderPerformanceList GetTraderPerformance(Fanex.Data.Repository.ICriteria criteria)
        {
            IEnumerable<TraderPerformanceInfo> traderData = this.GetData<TraderPerformanceInfo>(criteria);
            TraderPerformanceList traderPerformance = new TraderPerformanceList();

            if (traderData != null && traderData.Any())
            {
                // Non live
                var traderPerformanceNonLive = traderData.AsEnumerable()
                                                .Where(c => !c.IsLive)
                                                .Select(c => c);

                // Live
                var traderPerformanceLive = traderData.AsEnumerable()
                                                .Where(c => c.IsLive)
                                                .Select(c => c);

                traderPerformance.AddTraderList(traderPerformanceNonLive, false);
                traderPerformance.AddTraderList(traderPerformanceLive, true);

                traderPerformance.Total.Margin = CalculateTotalMargin(traderPerformance.Total.WinLoss, traderPerformance.Total.Turnover);
                SessionManager.Set<TraderPerformanceList>(TraderPerformanceDetailReportSessionKey, traderPerformance);
            }

            return traderPerformance;
        }

        /// <summary>
        /// Gets the match performance of a trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceList object.</returns>
        public MatchPerformanceList GetMatchPerformanceOfTrader(Fanex.Data.Repository.ICriteria criteria)
        {
            IEnumerable<MatchPerformanceInfo> matchData = this.GetData<MatchPerformanceInfo>(criteria);
            MatchPerformanceList matchPerformance = new MatchPerformanceList();

            IEnumerable<IGrouping<int?, MatchPerformanceInfo>> leagueGroups = matchData.GroupBy(obj => obj.LeagueId);
            MatchPerformanceGroup leagueGroup = null;

            foreach (IGrouping<int?, MatchPerformanceInfo> group in leagueGroups)
            {
                if (group.Key.HasValue)
                {
                    leagueGroup = new MatchPerformanceGroup(group.Key);
                    leagueGroup.AddMatchList(group, GetIsLive(criteria));
                    leagueGroup.Total.Margin = CalculateTotalMargin(leagueGroup.Total.WinLoss, leagueGroup.Total.Turnover);
                    matchPerformance.AddItem(leagueGroup);
                }
            }

            matchPerformance.GroupList = matchPerformance.GroupList.OrderBy(obj => obj.LeagueName).ToList();
            matchPerformance.GrandTotal.Margin = CalculateTotalMargin(matchPerformance.GrandTotal.WinLoss, matchPerformance.GrandTotal.Turnover);
            matchPerformance.TotalItems = matchData.Count();
            return matchPerformance;
        }

        private bool GetIsLive(ICriteria criteria)
        {
            if (criteria is GetMatchPerformanceOfTraderLeagueTeam)
            {
                return (criteria as GetMatchPerformanceOfTraderLeagueTeam).IsLive;
            }

            if (criteria is GetMatchPerformanceOfTraderCriteria)
            {
                return (criteria as GetMatchPerformanceOfTraderCriteria).IsLive;
            }

            if(criteria is GetLeagueDetailTeamCriteria)
            {
                return (criteria as GetLeagueDetailTeamCriteria).IsLive;
            }

            if (criteria is GetLeaguePerformanceCriteria)
            {
                return (criteria as GetLeaguePerformanceCriteria).MarketFilter == Market.Live;
            }

            return false;
        }

        /// <summary>
        /// Gets the bet type detail from trader report.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of bet type detail objects.</returns>
        public IEnumerable<BetTypeDetailItem> GetBettypeDetailTrader(GetBettypeDetailTrader criteria)
        {
            IEnumerable<BetTypeDetailInfo> bettypeData = this.GetData<BetTypeDetailInfo>(criteria);
            List<BetTypeDetailItem> bettypeDetail = new List<BetTypeDetailItem>();

            if (bettypeData != null && bettypeData.Any())
            {
                if (criteria.IsLive)
                {
                    GetScoreByPeriodCriteria scoreByPeriodCriteria = new GetScoreByPeriodCriteria
                    {
                        FromDate = criteria.FromDate,
                        ToDate = criteria.ToDate,
                        CustId = criteria.CustId,
                        MatchId = criteria.MatchId,
                        Bettypes = string.Join(",", bettypeData.Select(b => b.BetType.ToString())),
                        IsExcludeLeagues = AppSession.IsExcludingLeagues,
                        LeagueGroupIds = criteria.LeagueGroupIds
                    };

                    IEnumerable<ScoreByPeriodInfo> scoreByPeriodData = this.GetData<ScoreByPeriodInfo>(scoreByPeriodCriteria);
                    bettypeDetail = scoreByPeriodData.Any() ? bettypeData.Select(b => new BetTypeDetailItem(b)
                    {
                        Score = scoreByPeriodData.Where(s => s.BetType == b.BetType).First().Score,
                        ScoreByPeriod = scoreByPeriodData.Where(s => s.BetType == b.BetType).ToList().Select(i => new ScoreByPeriodItem(i)).ToList()
                    }).ToList() : new List<BetTypeDetailItem>();
                }
                else
                {
                    bettypeDetail = bettypeData.Select(b => new BetTypeDetailItem(b)
                    {
                        Score = null,
                        ScoreByPeriod = new List<ScoreByPeriodItem>()
                    }).ToList();
                }
            }

            return bettypeDetail;
        }

        /// <summary>
        /// Export Trader Performance to excel.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="templatePath">Path to Excel template file.</param>
        public void ExportTraderPerformance(int userId, GetTraderPerformanceCriteria criteria, string templatePath, bool isViewScore)
        {
            TraderPerformanceList traderData = SessionManager.Get<TraderPerformanceList>(TraderPerformanceDetailReportSessionKey);

            if ((traderData != null) && (traderData.ItemLiveList.Count > 0 || traderData.ItemNonLiveList.Count > 0))
            {
                string reportName = string.Format(
                                ViewLang.PerformanceDetailFileName,
                                ViewLang.Trader,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());

                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.TraderPerformance);
                writer.CopyRows(0, 1);
                FilterBlock(userId, criteria, ref writer);
                FillHeader(ref writer);
                writer.FreezeRow(0, 3);
                FillRowData(traderData, criteria.Market, ref writer, isViewScore);
                writer.SyncColumnsWidth(10);

                if (!isViewScore)
                {
                    writer.SetColumnHidden(10);
                }

                writer.Render();
            }
        }

        /// <summary>
        /// Fills the content row.
        /// </summary>
        /// <param name="contentData">The content data.</param>
        /// <param name="writer">The writer that is used to write Excel content.</param>
        private void FillRowData(TraderPerformanceList contentData, short Market, ref ExcelTemplateWriter writer, bool isViewScore)
        {
            // Content rows
            if (contentData.ItemLiveList.Any())
            {
                FillGroupName(ref writer, ViewLang.MarketLive);
                FillGroupRowData(contentData.ItemLiveList, ref writer, isViewScore);
            }

            if (contentData.ItemNonLiveList.Any())
            {
                FillGroupName(ref writer, ViewLang.MarketNonLive);
                FillGroupRowData(contentData.ItemNonLiveList, ref writer, isViewScore);
            }

            // Total row
            TraderPerformanceItem total = contentData.Total;
            var totalRecord = new object[]
            {
                ViewLang.GrandTotal,
                null,
                null,
                null,
                total.NoOfLeagues,
                total.NoOfMatches,
                total.Turnover,
                total.Turnover / total.NoOfMatches,
                total.WinLoss,
                total.BetCount,
                (object)total.Margin ?? ViewLang.NA,
                string.Empty
            };
            writer.WriteRow(6, totalRecord);
        }

        private void FillGroupRowData(List<TraderPerformanceItem> items, ref ExcelTemplateWriter writer, bool isViewScore)
        {
            var styleIndex = 4;
            var index = 0;

            foreach (var item in items)
            {
                var record = new object[]
                {
                    ++index,
                    item.TraderName,
                    item.Grade,
                    item.TeamName,
                    item.NoOfLeagues,
                    item.NoOfMatches,
                    item.Turnover,
                    item.Turnover / item.NoOfMatches,
                    item.WinLoss,
                    item.BetCount,
                    (object)item.Margin ?? ViewLang.NA,
                    isViewScore ? (object)item.Score ?? ViewLang.NA : ViewLang.NA
                };
                writer.WriteRow(styleIndex, record);
            }
        }

        /// <summary>
        /// Make Filter row.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="writer">The writer that is used to write Excel content.</param>
        [SuppressMessage("StyleCop.CSharp.StylecopPlus.Rules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Need to review here.")]
        private void FilterBlock(int userId, GetTraderPerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            RichTextRender contentRender = new RichTextRender().Clear();
            IFont boldFont = writer.GetFont(10, 0);
            IFont normalFont = writer.GetFont(11, 0);
            int lineCount = 0;

            var permission = (PermissionCheck == null) ? Models.Permission.BettypeViewPermission.All : ReportUtil.GetBettypePermission(PermissionCheck);

            List<BetTypeItem> betTypes = this.GetBetTypes(userId, permission).ToList();
            string betTypeString = MakeBetTypeSelectString(betTypes, criteria.BetTypes);
            string turnoverString = (criteria.Turnover != null) ? criteria.Turnover.Format(2) : string.Empty;
            string winlostString = (criteria.WinLoss != null) ? criteria.WinLoss.Format(2) : string.Empty;
            string marketString = criteria.Market == -1 ? ViewLang.MarketAll : (criteria.Market == 1 ? ViewLang.MarketLive : ViewLang.MarketNonLive);
            var leagueGroupNameString = MakeLeagueGroupSelectString(criteria.LeagueGroupIds);

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Market, boldFont, marketString, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.BetType, boldFont, betTypeString, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MinimumTurnover, boldFont, turnoverString, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MinimumWinLoss, boldFont, winlostString, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.LeagueGroup, boldFont, leagueGroupNameString, normalFont, "\n");

            //// Margin
            string marginFromString = MinPercentString;
            string marginToString = MaxPercentString;
            if (criteria.MarginFrom != null)
            {
                marginFromString = criteria.MarginFrom.ToString();
            }

            if (criteria.MarginTo != null)
            {
                marginToString = criteria.MarginTo.ToString();
            }

            if (criteria.MarginFrom != null || criteria.MarginTo != null)
            {
                string marginString;
                if (criteria.MarginFrom == null)
                {
                    marginString = string.Format("≤ {0}", criteria.MarginTo);
                }
                else if (criteria.MarginTo == null)
                {
                    marginString = string.Format("≥ {0}", criteria.MarginFrom);
                }
                else
                {
                    marginString = string.Format("from {0} to {1}", marginFromString, marginToString);
                }

                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Margin, boldFont, marginString, normalFont, "\n");
            }

            //// Trader
            string userNameString = (criteria.Username != null) ? string.Format("contains '{0}'", criteria.Username) : string.Empty;
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Trader, boldFont, userNameString, normalFont, "\n");

            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(7, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }      
    }
}