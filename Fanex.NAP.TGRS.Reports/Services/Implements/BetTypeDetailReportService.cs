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
    using Fanex.Data;

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

                traderPerformance.Total.MarginReal = CalculateTotalMargin(traderPerformance.Total.WinLossReal, traderPerformance.Total.TurnoverReal);
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
                        leagueGroup.Total.MarginReal = CalculateTotalMargin(leagueGroup.Total.WinLossReal, leagueGroup.Total.TurnoverReal);
                        leagueGroup.Total.Score = leagueGroup.Total.SumCategory == 0 ? 0 : (leagueGroup.Total.WinLossScore * 100 / leagueGroup.Total.SumCategory);
                        matchPerformance.AddItem(leagueGroup);
                    }
                }

                matchPerformance.GroupList = matchPerformance.GroupList.OrderBy(obj => obj.LeagueName).ToList();
                matchPerformance.GrandTotal.Margin = CalculateTotalMargin(matchPerformance.GrandTotal.WinLoss, matchPerformance.GrandTotal.Turnover);
                matchPerformance.GrandTotal.MarginReal = CalculateTotalMargin(matchPerformance.GrandTotal.WinLossReal, matchPerformance.GrandTotal.TurnoverReal);
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
                leaguePerformance.Total.MarginReal = CalculateTotalMargin(leaguePerformance.Total.WinLossReal, leaguePerformance.Total.TurnoverReal);
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
                leaguePerformance.Total.MarginReal = CalculateTotalMargin(leaguePerformance.Total.WinLossReal, leaguePerformance.Total.TurnoverReal);
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

        public BetTypeBetChoiceList GetBetChoicePerformanceOfBetTypeLeague(GetBetChociePerformanceOfBetTypeLeagueCriteria criteria)
        {
            var betTypeBetChoiceList = new BetTypeBetChoiceList();

            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    var betChoiceData = multi.Read<BetTypeBetChoicePerformanceInfo>();
                    var fmBetTypeData = multi.Read<bool>();

                    if (fmBetTypeData != null && fmBetTypeData.Any())
                    {
                        betTypeBetChoiceList.IsFMBetType = fmBetTypeData.ToList()[0];                        
                    }                    
                    betTypeBetChoiceList.AddItem(betChoiceData);
                }
            }

            return betTypeBetChoiceList;
        }

        public IEnumerable<IntervalBetChoicePerformanceInfo> GetIntervalPerformanceOfBetTypeLeagueBetChoice(GetIntervalPerformanceOfBetTypeLeagueBetChoiceCriteria criteria)
        {
            var result = this.GetData<IntervalBetChoicePerformanceInfo>(criteria);

            result = result ?? new List<IntervalBetChoicePerformanceInfo>();

            return result;
        }        

        public IEnumerable<IntervalBetChoicePerformanceInfo> GetIntervalPerformanceOfBetTypeBetChoice(GetIntervalPerformanceOfBetTypeBetChoiceCriteria criteria)
        {
            var result = this.GetData<IntervalBetChoicePerformanceInfo>(criteria);

            result = result ?? new List<IntervalBetChoicePerformanceInfo>();

            return result;
        }       

        public PointHDPPerformanceList GetPointHDPPerformanceOfBetTypeBetChoice(GetPointHDPPerformanceOfBetTypeBetChoiceCriteria criteria)
        {
            var pointHDPList = new PointHDPPerformanceList();

            var pointHDPData = this.GetData<PointHDPPerformanceInfo>(criteria);            

            if (pointHDPData != null && pointHDPData.Any())
            {
                pointHDPList.AddItem(pointHDPData);

                pointHDPList.Total.Margin = CalculateTotalMargin(pointHDPList.Total.WinLoss, pointHDPList.Total.Turnover);
                pointHDPList.Total.MarginReal = CalculateTotalMargin(pointHDPList.Total.WinLossReal, pointHDPList.Total.TurnoverReal);
            }

            return pointHDPList;
        }

        public LeaguePerformanceList GetLeaguePerformanceOfBetTypeBetChoicePointHDP(GetLeagueOfBetTypeBetChoicePointHDPCriteria criteria)
        {
            IEnumerable<LeaguePerformanceInfo> leagueData = this.GetData<LeaguePerformanceInfo>(criteria);
            LeaguePerformanceList leaguePerformance = new LeaguePerformanceList();

            if (leagueData != null && leagueData.Any())
            {
                leaguePerformance.AddLeagueList(leagueData, criteria.IsLive);
                leaguePerformance.Total.Margin = CalculateTotalMargin(leaguePerformance.Total.WinLoss, leaguePerformance.Total.Turnover);
                leaguePerformance.Total.MarginReal = CalculateTotalMargin(leaguePerformance.Total.WinLossReal, leaguePerformance.Total.TurnoverReal);                
            }

            return leaguePerformance;
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

            if ((betTypeData != null) 
                && (betTypeData.ItemByOrderList.Count > 0 
                    || betTypeData.ItemLiveList.Count > 0 
                    || betTypeData.ItemNonLiveList.Count > 0))
            {
                string reportName = string.Format(
                                    ViewLang.PerformanceDetailFileName,
                                    ViewLang.BetTypeExcelFile,
                                    criteria.FromDate.ToShortFormatedDateForFileName(),
                                    criteria.ToDate.ToShortFormatedDateForFileName());
                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.BetTypePerformance);

                writer.CopyRows(0, 1);

                FilterBlock(userId, criteria, ref writer);
                
                var rowHeader = writer.CopyRows(3, 2);

                if (!criteria.IsVirtual && criteria.IsReal)
                {
                    var cellHeader = rowHeader.GetCell(7);

                    cellHeader.SetCellValue("Real");
                }                

                FillRowData(betTypeData, criteria, ref writer);
                
                if (criteria.IsReal && criteria.IsVirtual)
                    writer.SyncColumnsWidth(15);
                else
                    writer.SyncColumnsWidth(11);

                writer.Render();
            }
        }      

        /// <summary>
        /// Fills the content row.
        /// </summary>
        /// <param name="contentData">The content data.</param>
        /// <param name="writer">The writer that is used to write Excel content.</param>
        private void FillRowData(BetTypePerformanceList data, GetBetTypePerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            // Content rows
            BetTypePerformanceItem item;

            var contentData = criteria.Market == -1 ? data.ItemByOrderList : (criteria.Market == 1 ? data.ItemLiveList : data.ItemNonLiveList);
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

                int styleIndex = bettypeCounter % 2 == 0 ? 5 : 6;

                var record = new List<object>
                {
                    i + 1,
                    item.BetTypeName,
                    item.IsLive ? ViewLang.MarketLive : ViewLang.MarketNonLive,
                    item.NoOfTraders,
                    item.NoOfLeagues,
                    item.NoOfMatches,
                    item.BetCount,                 
                };

                if (criteria.IsVirtual)
                {
                    record.AddRange(new object[] {
                        item.Turnover,                        
                        item.NoOfMatches != 0 ? (object)(item.Turnover / item.NoOfMatches) : ViewLang.NA,
                        item.WinLoss,
                        (object)item.Margin ?? ViewLang.NA
                    });
                }

                if (criteria.IsReal)
                {
                    record.AddRange(new object[] {
                        item.TurnoverReal,                        
                        item.NoOfMatches != 0 ? (object)(item.TurnoverReal / item.NoOfMatches) : ViewLang.NA,
                        item.WinLossReal,
                        (object)item.MarginReal ?? ViewLang.NA
                    });
                }            

                writer.WriteRow(styleIndex, record.ToArray());
            }

            if (criteria.Market == -1)
            {
                var totalRecord = CreateRecord(ref writer, data.TotalItemLive, criteria, ViewLang.GrandTotal, true);

                writer.WriteRow(7, totalRecord.ToArray());
                
                totalRecord = CreateRecord(ref writer, data.TotalItemNonLive, criteria, null, false);

                writer.WriteRow(8, totalRecord.ToArray());
            }
            else
            {
                var totalRecord = CreateRecord(ref writer, data.Total, criteria, ViewLang.GrandTotal, criteria.Market == 1);

                writer.WriteRow(7, totalRecord.ToArray());
            }
        }

        private List<object> CreateRecord(ref ExcelTemplateWriter writer, BetTypePerformanceItem total, GetBetTypePerformanceCriteria criteria, string grandTotal, bool isLive)
        {
            var record = new List<object>
                {
                    grandTotal,
                    null,
                    isLive ? ViewLang.MarketLive : ViewLang.MarketNonLive,
                    total.NoOfTraders,
                    total.NoOfLeagues,
                    total.NoOfMatches,
                    total.BetCount,                  
                };

            if (criteria.IsVirtual)
            {
                record.AddRange(new object[] {
                        total.Turnover,
                        total.NoOfMatches != 0 ? (object)(total.Turnover / total.NoOfMatches) : ViewLang.NA,
                        total.WinLoss,
                        (object)total.Margin ?? ViewLang.NA
                    });
            }

            if (criteria.IsReal)
            {
                record.AddRange(new object[] {
                        total.TurnoverReal,
                        total.NoOfMatches != 0 ? (object)(total.TurnoverReal / total.NoOfMatches) : ViewLang.NA,
                        total.WinLossReal,
                        (object)total.MarginReal ?? ViewLang.NA
                    });
            }

            return record;
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
            IFont boldFont = writer.GetFont(11, 0);
            IFont normalFont = writer.GetFont(12, 0);
            int lineCount = 0;

            var permission = PermissionCheck == null ? Models.Permission.BettypeViewPermission.All : ReportUtil.GetBettypePermission(PermissionCheck);
            List<BetTypeItem> betTypes = this.GetBetTypes(userid, permission).ToList();
            string betTypeString = MakeBetTypeSelectString(betTypes, criteria.Bettypes);          
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
            }

            if (criteria.IsReal)
            {
                string realTurnoverString = (criteria.TurnoverReal != null) ? criteria.TurnoverReal.Format(2) : string.Empty;
                string realWinlostString = (criteria.WinLossReal != null) ? criteria.WinLossReal.Format(2) : string.Empty;

                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MinimumRealTurnover, boldFont, realTurnoverString, normalFont, "\n");
                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MinimumRealWinLoss, boldFont, realWinlostString, normalFont, "\n");
            }            
                                             
            if (criteria.IsVirtual && criteria.MarginFrom != null || criteria.MarginTo != null)
            {
                var marginString = GenerateMarginString(criteria.MarginFrom, criteria.MarginTo);

                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.VirtualMargin, boldFont, marginString, normalFont, "\n");
            }

            if (criteria.IsReal && criteria.MarginFromReal != null || criteria.MarginToReal != null)
            {
                var marginString = GenerateMarginString(criteria.MarginFromReal, criteria.MarginToReal);

                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.RealMargin, boldFont, marginString, normalFont, "\n");
            }

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.LeagueGroup, boldFont, leagueGroupNameString, normalFont, "");

            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(9, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }

        private string GenerateMarginString(decimal? marginFrom, decimal? marginTo)
        {         
            var marginFromString = marginFrom != null ? marginFrom.ToString() : MinPercentString;
            var marginToString = marginTo != null ? marginTo.ToString() : MaxPercentString;

            if (marginFrom == null)
                return string.Format("≤ {0}", marginTo);
            else if (marginTo == null)
                return string.Format("≥ {0}", marginFrom);
            else
                return string.Format("from {0} to {1}", marginFromString, marginToString);
        }

        public BetTypeBetChoiceList GetBetTypeBetChoicePerformance(GetBetChoicePerformanceOfBetTypeCriteria criteria)
        {
            var betTypeBetChoiceList = new BetTypeBetChoiceList();

            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    var betChoiceData = multi.Read<BetTypeBetChoicePerformanceInfo>();
                    var betChoiceOfBetTypeInfo = multi.Read<FMBetTypeBetChoiceInfo>();

                    if (betChoiceOfBetTypeInfo != null && betChoiceOfBetTypeInfo.Any())
                    {
                        //betTypeBetChoiceList.IsFMBetType = betChoiceOfBetTypeInfo.ToList()[0].IsFMBetType;                        
                        betTypeBetChoiceList.IsBetChoiceDetail = betChoiceOfBetTypeInfo.ToList()[0].IsBetChoiceDetail;

                        betTypeBetChoiceList.IsFMBetType = false; // for test
                    }                    
                    betTypeBetChoiceList.AddItem(betChoiceData);
                }
            }

            return betTypeBetChoiceList;
        }
    }
}