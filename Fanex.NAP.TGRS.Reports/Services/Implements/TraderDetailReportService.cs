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
                var traderPerformanceNonLive = traderData.AsEnumerable().Where(c => !c.IsLive).Select(c => c);

                // Live
                var traderPerformanceLive = traderData.AsEnumerable().Where(c => c.IsLive).Select(c => c);

                traderPerformance.AddTraderList(traderPerformanceNonLive, false);
                traderPerformance.AddTraderList(traderPerformanceLive, true);

                traderPerformance.Total.Margin = CalculateTotalMargin(traderPerformance.Total.WinLoss, traderPerformance.Total.Turnover);
                traderPerformance.Total.MarginReal = CalculateTotalMargin(traderPerformance.Total.WinLossReal, traderPerformance.Total.TurnoverReal);

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
                    leagueGroup.Total.MarginReal = CalculateTotalMargin(leagueGroup.Total.WinLossReal, leagueGroup.Total.TurnoverReal);
                    matchPerformance.AddItem(leagueGroup);
                }
            }

            matchPerformance.GroupList = matchPerformance.GroupList.OrderBy(obj => obj.LeagueName).ToList();
            matchPerformance.GrandTotal.Margin = CalculateTotalMargin(matchPerformance.GrandTotal.WinLoss, matchPerformance.GrandTotal.Turnover);
            matchPerformance.GrandTotal.MarginReal = CalculateTotalMargin(matchPerformance.GrandTotal.WinLossReal, matchPerformance.GrandTotal.TurnoverReal);
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
                
                var rowHeader = writer.CopyRows(3, 2);

                //writer.FreezeRow(0, 4);

                if(!criteria.IsVirtual && criteria.IsReal)
                {
                    var cellHeader = rowHeader.GetCell(8);

                    cellHeader.SetCellValue("Real");
                }

                FillRowData(traderData, criteria, ref writer, isViewScore);

                if (criteria.IsVirtual && criteria.IsReal)     
                    writer.SyncColumnsWidth(16);
                else
                    writer.SyncColumnsWidth(12);
            
                if (!isViewScore)
                {
                    writer.SetColumnHidden(7);
                }

                writer.Render();
            }
        }

        /// <summary>
        /// Fills the content row.
        /// </summary>
        /// <param name="contentData">The content data.</param>
        /// <param name="writer">The writer that is used to write Excel content.</param>
        private void FillRowData(TraderPerformanceList contentData, GetTraderPerformanceCriteria criteria, ref ExcelTemplateWriter writer, bool isViewScore)
        {
            // Content rows
            if (contentData.ItemLiveList.Any())
            {
                FillTraderGroupName(ref writer, ViewLang.MarketLive);
                FillGroupRowData(contentData.ItemLiveList, ref writer, isViewScore, criteria);
            }

            if (contentData.ItemNonLiveList.Any())
            {
                FillTraderGroupName(ref writer, ViewLang.MarketNonLive);
                FillGroupRowData(contentData.ItemNonLiveList, ref writer, isViewScore, criteria);
            }

            // Total row
            TraderPerformanceItem total = contentData.Total;
            
            var record = new List<object>
                {
                    ViewLang.GrandTotal,
                    null,
                    null,
                    null,
                    total.NoOfLeagues,
                    total.NoOfMatches,
                    total.BetCount,
                    string.Empty
                };

            if (criteria.IsVirtual)
            {
                record.AddRange(new object[] {
                        total.Turnover,
                        total.Turnover / total.NoOfMatches,
                        total.WinLoss,
                        (object)total.Margin ?? ViewLang.NA
                    });
            }

            if (criteria.IsReal)
            {
                record.AddRange(new object[] {
                        total.TurnoverReal,
                        total.TurnoverReal / total.NoOfMatches,
                        total.WinLossReal,
                        (object)total.MarginReal ?? ViewLang.NA
                    });
            }

            writer.WriteRow(7, record.ToArray());
        }

        private void FillTraderGroupName(ref ExcelTemplateWriter writer, string groupName)
        {
            var contentRender = new RichTextRender().Clear();
            IFont boldFont = writer.GetFont(12, 0);
            TextBlock nameBlock = new TextBlock(groupName, boldFont);
            contentRender = contentRender.AddText(nameBlock);

            WriteRowFromRichText(6, contentRender, ref writer);
        }

        private void FillGroupRowData(List<TraderPerformanceItem> items, ref ExcelTemplateWriter writer, bool isViewScore, GetTraderPerformanceCriteria criteria)
        {
            var styleIndex = 5;
            var index = 0;

            foreach (var item in items)
            {
                var record = new List<object>
                {
                    ++index,
                    item.TraderName,
                    item.Grade,
                    item.TeamName,
                    item.NoOfLeagues,
                    item.NoOfMatches,
                    item.BetCount,
                    isViewScore ? (object)item.Score ?? ViewLang.NA : ViewLang.NA
                };

                if (criteria.IsVirtual)
                {
                    record.AddRange(new object[] {
                        item.Turnover,
                        item.Turnover / item.NoOfMatches,
                        item.WinLoss,
                        (object)item.Margin ?? ViewLang.NA
                    });
                }

                if (criteria.IsReal)
                {
                    record.AddRange(new object[] {
                        item.TurnoverReal,
                        item.TurnoverReal / item.NoOfMatches,
                        item.WinLossReal,
                        (object)item.MarginReal ?? ViewLang.NA
                    });
                }

                writer.WriteRow(styleIndex, record.ToArray());
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
            IFont boldFont = writer.GetFont(11, 0);
            IFont normalFont = writer.GetFont(12, 0);
            int lineCount = 0;

            var permission = (PermissionCheck == null) ? Models.Permission.BettypeViewPermission.All : ReportUtil.GetBettypePermission(PermissionCheck);

            List<BetTypeItem> betTypes = this.GetBetTypes(userId, permission).ToList();
            string betTypeString = MakeBetTypeSelectString(betTypes, criteria.BetTypes);
           
            string marketString = criteria.Market == -1 ? ViewLang.MarketAll : (criteria.Market == 1 ? ViewLang.MarketLive : ViewLang.MarketNonLive);
            var leagueGroupNameString = MakeLeagueGroupSelectString(criteria.LeagueGroupIds);

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Market, boldFont, marketString, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.BetType, boldFont, betTypeString, normalFont, "\n");

            if (criteria.IsVirtual)
            {
                string turnoverString = (criteria.Turnover != null) ? criteria.Turnover.Format(2) : string.Empty;
                string winlostString = (criteria.WinLoss != null) ? criteria.WinLoss.Format(2) : string.Empty;

                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MinimumVirtualTurnover, boldFont, turnoverString, normalFont, "\n");
                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MinimumVirtualWinLoss, boldFont, winlostString, normalFont, "\n");

                if (criteria.MarginFrom != null || criteria.MarginTo != null)
                {
                    var marginString = GenerateMarginString(criteria.MarginFrom, criteria.MarginTo);

                    AppendBlockContent(ref contentRender, ref lineCount, ViewLang.VirtualMargin, boldFont, marginString, normalFont, "\n");
                }
            }

            if (criteria.IsReal)
            {
                string realTurnoverString = (criteria.TurnoverReal != null) ? criteria.TurnoverReal.Format(2) : string.Empty;
                string realWinlostString = (criteria.WinLossReal != null) ? criteria.WinLossReal.Format(2) : string.Empty;

                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MinimumRealTurnover, boldFont, realTurnoverString, normalFont, "\n");
                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MinimumRealWinLoss, boldFont, realWinlostString, normalFont, "\n");

                if (criteria.MarginFromReal != null || criteria.MarginToReal != null)
                {
                    var marginString = GenerateMarginString(criteria.MarginFromReal, criteria.MarginToReal);

                    AppendBlockContent(ref contentRender, ref lineCount, ViewLang.RealMargin, boldFont, marginString, normalFont, "\n");
                }
            }           

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.LeagueGroup, boldFont, leagueGroupNameString, normalFont, "\n");
           
            //// Trader
            string userNameString = (criteria.Username != null) ? string.Format("contains '{0}'", criteria.Username) : string.Empty;
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Trader, boldFont, userNameString, normalFont, "\n");

            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(8, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }      
    }
}