// --------------------------------------------------------------------------
// <copyright file="BetTypeDetailReportService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.9">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Services
{
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
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

    /// <summary>
    /// Detail report service.
    /// </summary>
    public partial class DetailReportService : TGRSBaseService, IDetailReportService
    {
        private const string BetTypePerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.Reports.BetTypePerformance";

        /// <summary>
        /// Gets the bet type performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>BetTypePerformanceList object.</returns>
        public BetTypePerformanceList GetBetTypePerformance(GetBetTypePerformanceCriteria criteria)
        {
            IEnumerable<BetTypePerformanceInfo> betTypeData = this.GetData<BetTypePerformanceInfo>(criteria);
            BetTypePerformanceList betTypePerformance = new BetTypePerformanceList();

            if (betTypeData != null && betTypeData.Any())
            {
                if (criteria.MarketFilter == Market.All)
                {
                    var data = SortBetTypePerformanceInfo(betTypeData);

                    betTypePerformance.AddBetTypeList(data);
                }
                else
                {
                    betTypePerformance.AddBetTypeList(betTypeData, criteria.MarketFilter == Market.Live);
                }

                betTypePerformance.CalculateTotalMargin();
                SessionManager.Set<BetTypePerformanceList>(BetTypePerformanceDetailReportSessionKey, betTypePerformance);
            }

            return betTypePerformance;
        }

        private IEnumerable<BetTypePerformanceInfo> SortBetTypePerformanceInfo(IEnumerable<BetTypePerformanceInfo> betTypeData)
        {
            return betTypeData.AsEnumerable()
                              .OrderByDescending(c => c.BetType)
                              .ThenByDescending(c => c.IsLive)
                              .Select(c => new BetTypePerformanceInfo
                              {
                                  BetType = c.BetType,                                 
                                  TypeName = c.TypeName,
                                  TraderCount = c.TraderCount,
                                  LeagueCount = c.LeagueCount,
                                  MatchCount = c.MatchCount,
                                  Turnover = c.Turnover,
                                  WinLoss = c.WinLoss,
                                  Margin = c.Margin,
                                  TurnoverReal = c.TurnoverReal,
                                  WinLossReal = c.WinLossReal,
                                  MarginReal = c.MarginReal,
                                  BetCount = c.BetCount,                                  
                                  IsLive = c.IsLive,
                                  FlagForViewReport = betTypeData.Count(b => b.BetType == c.BetType)
                              });
        }

        /// <summary>
        /// Gets the trader performance of a bet type.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>TraderPerformanceList object.</returns>
        public TraderPerformanceList GetTraderPerformanceOfBetType(GetTraderPerformanceOfBetTypeCriteria criteria)
        {
            IEnumerable<TraderPerformanceInfo> traderData = this.GetData<TraderPerformanceInfo>(criteria);
            TraderPerformanceList traderPerformance = new TraderPerformanceList();

            if (traderData != null && traderData.Any())
            {
                traderPerformance.AddTraderList(traderData, criteria.IsLive);
               
                traderPerformance.Total.Margin = CalculateTotalMargin(traderPerformance.Total.WinLoss, traderPerformance.Total.Turnover);
            }

            return traderPerformance;
        }

        /// <summary>
        /// Gets the match performance of a pair of bet type and trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceList object.</returns>
        public MatchPerformanceList GetMatchPerformanceOfBetTypeTrader(GetMatchPerformanceOfBetTypeTraderCriteria criteria)
        {
            IEnumerable<MatchPerformanceRawInfo> matchData = this.GetData<MatchPerformanceRawInfo>(criteria);
            MatchPerformanceList matchPerformance = new MatchPerformanceList();

            if (matchData != null && matchData.Any())
            {
                IEnumerable<IGrouping<int?, MatchPerformanceRawInfo>> leagueGroups = matchData.GroupBy(obj => obj.LeagueId);
                MatchPerformanceGroup leagueGroup = null;

                foreach (IGrouping<int?, MatchPerformanceRawInfo> group in leagueGroups)
                {
                    if (group.Key.HasValue)
                    {
                        leagueGroup = new MatchPerformanceGroup(group.Key);
                        leagueGroup.AddMatchList(group, criteria.IsLive);
                        leagueGroup.Total.Margin = CalculateTotalMargin(leagueGroup.Total.WinLoss, leagueGroup.Total.Turnover);
                        leagueGroup.Total.Score = leagueGroup.Total.SumCategory == 0 ? 0 : (leagueGroup.Total.WinLossScore * 100 / leagueGroup.Total.SumCategory);
                        matchPerformance.AddItem(leagueGroup);
                    }
                }

                matchPerformance.GroupList = matchPerformance.GroupList.OrderBy(obj => obj.LeagueName).ToList();
                matchPerformance.GrandTotal.Margin = CalculateTotalMargin(matchPerformance.GrandTotal.WinLoss, matchPerformance.GrandTotal.Turnover);
                matchPerformance.TotalItems = matchData.Count();
            }

            return matchPerformance;
        }

        /// <summary>
        /// Gets the league performance of bet type.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>LeaguePerformanceList object.</returns>
        public LeaguePerformanceList GetLeaguePerformanceOfBetType(GetLeaguePerformanceOfBetTypeCriteria criteria)
        {
            IEnumerable<LeaguePerformanceInfo> leagueData = this.GetData<LeaguePerformanceInfo>(criteria);
            LeaguePerformanceList leaguePerformance = new LeaguePerformanceList();

            if (leagueData != null && leagueData.Any())
            {
                leaguePerformance.AddLeagueList(leagueData, criteria.IsLive);
                leaguePerformance.Total.Margin = CalculateTotalMargin(leaguePerformance.Total.WinLoss, leaguePerformance.Total.Turnover);
                SessionManager.Set<LeaguePerformanceList>(LeaguePerformanceDetailReportSessionKey, leaguePerformance);
            }

            return leaguePerformance;
        }

        public LeaguePerformanceList GetLeaguePerformanceOfBetChoice(GetLeaguePerformanceOfBetChoiceCriteria criteria)
        {
            IEnumerable<LeaguePerformanceInfo> leagueData = this.GetData<LeaguePerformanceInfo>(criteria);
            LeaguePerformanceList leaguePerformance = new LeaguePerformanceList();

            if (leagueData != null && leagueData.Any())
            {
                leaguePerformance.AddLeagueList(leagueData, criteria.IsLive);
                leaguePerformance.Total.Margin = CalculateTotalMargin(leaguePerformance.Total.WinLoss, leaguePerformance.Total.Turnover);
                SessionManager.Set<LeaguePerformanceList>(LeaguePerformanceDetailReportSessionKey, leaguePerformance);
            }

            return leaguePerformance;
        }

        /// <summary>
        /// Gets the trader performance of a bet type, league.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>TraderPerformanceList object.</returns>
        public TraderPerformanceList GetTraderPerformanceOfBetTypeLeague(GetTraderPerformanceOfBetTypeLeagueCriteria criteria)
        {
            IEnumerable<TraderPerformanceInfo> traderData = this.GetData<TraderPerformanceInfo>(criteria);
            TraderPerformanceList traderPerformance = new TraderPerformanceList();

            if (traderData != null && traderData.Any())
            {
                traderPerformance.AddTraderList(traderData, criteria.IsLive);
                
                traderPerformance.Total.Margin = CalculateTotalMargin(traderPerformance.Total.WinLoss, traderPerformance.Total.Turnover);
                traderPerformance.Total.MarginReal = CalculateTotalMargin(traderPerformance.Total.WinLossReal, traderPerformance.Total.TurnoverReal);
            }

            return traderPerformance;
        }

        public IEnumerable<BetTypeBetChoicePerformanceInfo> GetBetChociePerformanceOfBetTypeLeague(GetBetChociePerformanceOfBetTypeLeagueCriteria criteria)
        {           
            var result = this.GetData<BetTypeBetChoicePerformanceInfo>(criteria);

            result = result ?? new List<BetTypeBetChoicePerformanceInfo>();

            return result;
        }

        /// <summary>
        /// Gets the match performance of bet type, league and trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceGroup object.</returns>
        public MatchPerformanceGroup GetMatchPerformanceOfBetTypeLeagueTrader(GetMatchPerformanceOfBetTypeLeagueTraderCriteria criteria)
        {
            IEnumerable<MatchPerformanceInfo> matchData = this.GetData<MatchPerformanceInfo>(criteria);
            MatchPerformanceGroup matchPerformance = new MatchPerformanceGroup();

            if (matchData != null && matchData.Any())
            {
                matchPerformance.AddMatchList(matchData, criteria.IsLive);
                matchPerformance.Total.Margin = CalculateTotalMargin(matchPerformance.Total.WinLoss, matchPerformance.Total.Turnover);
                matchPerformance.Total.MarginReal = CalculateTotalMargin(matchPerformance.Total.WinLossReal, matchPerformance.Total.TurnoverReal);
            }

            return matchPerformance;
        }

        /// <summary>
        /// Export Bet Type Performance to excel.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="templatePath">Path to Excel template file.</param>
        public void ExportBetTypePerformance(int userId, GetBetTypePerformanceCriteria criteria, string templatePath)
        {
            BetTypePerformanceList betTypeData = SessionManager.Get<BetTypePerformanceList>(BetTypePerformanceDetailReportSessionKey);

            if ((betTypeData != null) && (betTypeData.ItemByOrderList.Count > 0 || betTypeData.ItemLiveList.Count > 0 || betTypeData.ItemNonLiveList.Count > 0))
            {
                string reportName = string.Format(
                                    ViewLang.PerformanceDetailFileName,
                                    ViewLang.BetTypeExcelFile,
                                    criteria.FromDate.ToShortFormatedDateForFileName(),
                                    criteria.ToDate.ToShortFormatedDateForFileName());
                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.BetTypePerformance);

                writer.CopyRows(0, 1);
                FilterBlock(userId, criteria, ref writer);
                FillHeader(ref writer);
                writer.FreezeRow(0, 3);
                FillRowData(betTypeData, criteria.Market, ref writer);
                writer.SyncColumnsWidth(9);
                writer.Render();
            }
        }

        /// <summary>
        /// Fills the content row.
        /// </summary>
        /// <param name="contentData">The content data.</param>
        /// <param name="writer">The writer that is used to write Excel content.</param>
        private void FillRowData(BetTypePerformanceList data, short market, ref ExcelTemplateWriter writer)
        {
            // Content rows
            BetTypePerformanceItem item;

            var contentData = market == -1 ? data.ItemByOrderList : (market == 1 ? data.ItemLiveList : data.ItemNonLiveList);
            int len = contentData.Count;
            var bettypeId = contentData[0].BetTypeId;
            var bettypeCounter = 1;

            for (int i = 0; i < len; i++)
            {
                item = contentData[i];

                if (item.BetTypeId != bettypeId)
                {
                    bettypeCounter++;
                    bettypeId = item.BetTypeId;
                }

                int styleIndex = bettypeCounter % 2 == 0 ? 4 : 5;

                var record = new object[]
                {
                    i + 1,
                    item.BetTypeName,
                    item.IsLive ? ViewLang.MarketLive : ViewLang.MarketNonLive,
                    item.NoOfTraders,
                    item.NoOfLeagues,
                    item.NoOfMatches,
                    item.Turnover,
                    item.Turnover / item.NoOfMatches,
                    item.WinLoss,
                    item.BetCount,
                    (object)item.Margin ?? ViewLang.NA
                };

                writer.WriteRow(styleIndex, record);
            }

            if (market == -1)
            {
                // Total row
                BetTypePerformanceItem total = data.TotalItemLive;
                var totalRecord = new object[]
                {
                    ViewLang.GrandTotal,
                    null,
                    ViewLang.MarketLive,
                    total.NoOfTraders,
                    total.NoOfLeagues,
                    total.NoOfMatches,
                    total.Turnover,
                    total.Turnover / total.NoOfMatches,
                    total.WinLoss,
                    total.BetCount,
                    (object)total.Margin ?? ViewLang.NA
                };
                writer.WriteRow(6, totalRecord);

                total = data.TotalItemNonLive;
                totalRecord = new object[]
                {
                    null,
                    null,
                    ViewLang.MarketNonLive,
                    total.NoOfTraders,
                    total.NoOfLeagues,
                    total.NoOfMatches,
                    total.Turnover,
                    total.Turnover / total.NoOfMatches,
                    total.WinLoss,
                    total.BetCount,
                    (object)total.Margin ?? ViewLang.NA
                };
                writer.WriteRow(6, totalRecord);
            }
            else
            {
                BetTypePerformanceItem total = data.Total;
                var totalRecord = new object[]
                {
                    ViewLang.GrandTotal,
                    null,
                    market == 1 ? ViewLang.MarketLive : ViewLang.MarketNonLive,
                    total.NoOfTraders,
                    total.NoOfLeagues,
                    total.NoOfMatches,
                    total.Turnover,
                    total.Turnover / total.NoOfMatches,
                    total.WinLoss,
                    total.BetCount,
                    (object)total.Margin ?? ViewLang.NA
                };
                writer.WriteRow(6, totalRecord);
            }
        }

        /// <summary>
        /// Make Filter row.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="writer">The writer that is used to write Excel content.</param>
        [SuppressMessage("StyleCop.CSharp.StylecopPlus.Rules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Need to review here.")]
        private void FilterBlock(int userid, GetBetTypePerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            RichTextRender contentRender = new RichTextRender().Clear();
            IFont boldFont = writer.GetFont(10, 0);
            IFont normalFont = writer.GetFont(11, 0);
            int lineCount = 0;

            var permission = PermissionCheck == null ? Models.Permission.BettypeViewPermission.All : ReportUtil.GetBettypePermission(PermissionCheck);
            List<BetTypeItem> betTypes = this.GetBetTypes(userid, permission).ToList();
            string betTypeString = MakeBetTypeSelectString(betTypes, criteria.Bettypes);
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

            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(8, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }

        public IEnumerable<BetTypeBetChoicePerformanceInfo> GetBetTypeBetChoicePerformance(GetBetChoicePerformanceOfBetTypeCriteria criteria)
        {
            var result = this.GetData<BetTypeBetChoicePerformanceInfo>(criteria);

            result = result ?? new List<BetTypeBetChoicePerformanceInfo>();

            return result;
        }
    }
}