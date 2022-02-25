// --------------------------------------------------------------------------
// <copyright file="LeagueDetailReportService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.9">Created</change>
//   <change who="Ken.Nguyen" date="2014.6.12">Add Excel export</change>
// </history>

using Fanex.Data.Repository;

namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.ExcelUtility;
    using Fanex.NAP.TGRS.Core.ExcelUtility.RichTextExtensions;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.Permission;
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
        private const string LeaguePerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.Reports.LeaguePerformance";
        private const string DefaultBettypeSessionKey = "Fanex.NAP.TGRS.Reports.DefaultBettype";
        private const string LeagueGroupsSessionKey = "Fanex.NAP.TGRS.Reports.LeagueGroups";
        private const int PointInPixel = 225;
        private const string MinPercentString = "min";
        private const string MaxPercentString = "max";

        public bool IsExludeLeague = false;

        /// <summary>
        ///  Gets bet types by permissions
        /// </summary>
        /// <param name="permission">permission on bettype</param>
        /// <returns></returns>
        public IEnumerable<BetTypeItem> GetBetTypes(int userId, BettypeViewPermission permission = BettypeViewPermission.All)
        {
            List<BetTypeItem> betTypes = null;
            var criteria = new GetBetTypesCriteria(permission) { UserId = userId};
            IEnumerable<BetTypeInfo> data = this.GetData<BetTypeInfo>(criteria);

            if (data != null && data.Any())
            {
                betTypes = data.Select(obj => new BetTypeItem(obj)).ToList();
            }

            SessionManager.Set<List<BetTypeItem>>(DefaultBettypeSessionKey, betTypes);
            return betTypes ?? new List<BetTypeItem>();
        }

        public IEnumerable<GroupBetTypes> GetGroupBetTypes(int userId, BettypeViewPermission permission = BettypeViewPermission.All)
        {
            var groupBetTypes = Enumerable.Empty<GroupBetTypes>();
            List<BetTypeItem> betTypes = null;
            var criteria = new GetBetTypesCriteria(permission) { UserId = userId };
            IEnumerable<BetTypeInfo> data = this.GetData<BetTypeInfo>(criteria);            

            if (data != null && data.Any())
            {
                groupBetTypes = data
                    .GroupBy(g => new { g.GroupBettypeId, g.GroupBettypeName })
                    .Select(x => new { Group = x.Key, BetTypeList = x.ToList() })
                    .Select(x => new GroupBetTypes
                    {
                        GroupId = x.Group.GroupBettypeId,
                        GroupName = x.Group.GroupBettypeName,
                        TotalDefaultCheckOfBetTypeList = x.BetTypeList.Where(y=>y.IsDefault).Count(),
                        BetTypeList = x.BetTypeList.Select(y => new BetType
                        {
                            BetTypeId = y.BetType,
                            BetTypeName = y.TypeName,
                            IsDefaultCheck = y.IsDefault
                        })
                    });

               betTypes = data.Select(obj => new BetTypeItem(obj)).ToList();
            }

            SessionManager.Set<List<BetTypeItem>>(DefaultBettypeSessionKey, betTypes);

            return groupBetTypes;
        }

        public IEnumerable<LeagueGroup> GetLeagueGroups()
        {
            var criteria = new GetLeagueGroupSoccerCriteria { LeagueGroupIds = string.Empty };

            IEnumerable<LeagueGroup> leagueGroupList = this.GetData<LeagueGroup>(criteria);

            SessionManager.Set<List<LeagueGroup>>(LeagueGroupsSessionKey, leagueGroupList.ToList());

            return leagueGroupList;
        }

        /// <summary>
        /// Gets the bet types from session.
        /// </summary>
        /// <returns>List of BetTypeItem objects.</returns>
        public IEnumerable<BetTypeItem> GetBetTypesFromSession(int userId)
        {
            var betTypes = SessionManager.Get<List<BetTypeItem>>(DefaultBettypeSessionKey);
            if (betTypes == null)
            {
                var permission = (PermissionCheck == null) ? BettypeViewPermission.All : ReportUtil.GetBettypePermission(PermissionCheck);
                betTypes = this.GetBetTypes(userId, permission).ToList();
            }

            return betTypes;
        }

        /// <summary>
        /// Gets the league performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>LeaguePerformanceList object.</returns>
        public LeaguePerformanceList GetLeaguePerformance(Data.Repository.ICriteria criteria, bool isGroupOfLeague = false)
        {
            IEnumerable<LeaguePerformanceInfo> leagueData = this.GetData<LeaguePerformanceInfo>(criteria);
            LeaguePerformanceList leaguePerformance = new LeaguePerformanceList();

            if (leagueData != null && leagueData.Any())
            {
                if (isGroupOfLeague)
                {
                    var data = SortLeaguePerformanceInfo(leagueData);

                    leaguePerformance.AddLeagueList(data);
                }
                else
                {
                    var isLive = GetIsLive(criteria);

                    leaguePerformance.AddLeagueList(leagueData, isLive);
                }

                leaguePerformance.CalculateTotalMargin();
                SessionManager.Set<LeaguePerformanceList>(LeaguePerformanceDetailReportSessionKey, leaguePerformance);
            }

            return leaguePerformance;
        }

        private IEnumerable<LeaguePerformanceInfo> SortLeaguePerformanceInfo(IEnumerable<LeaguePerformanceInfo> leagueData)
        {
            return leagueData.AsEnumerable()
                            .OrderBy(c => c.LeagueId)
                            .ThenByDescending(c => c.IsLive)
                            .Select(c => new LeaguePerformanceInfo
                            {
                                LeagueId = c.LeagueId,
                                LeagueName = c.LeagueName,
                                LeagueGroupID = c.LeagueGroupID,
                                LeagueBenchmark = c.LeagueBenchmark,
                                BetTypeBMShift1 = c.BetTypeBMShift1,
                                BetTypeBMShift2 = c.BetTypeBMShift2,
                                BetTypeBMShift3 = c.BetTypeBMShift3,
                                TraderCount = c.TraderCount,
                                MatchCount = c.MatchCount,
                                Turnover = c.Turnover,
                                WinLoss = c.WinLoss,
                                Margin = c.Margin,
                                TurnoverReal = c.TurnoverReal,
                                WinLossReal = c.WinLossReal,
                                MarginReal = c.MarginReal,
                                BetCount = c.BetCount,                                
                                Market = c.Market,
                                IsLive = c.IsLive,
                                FlagForViewReport = leagueData.Count(b=>b.LeagueId == c.LeagueId)
                            });
        }

        /// <summary>
        /// Gets the trader performance of a league.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>TraderPerformanceList object.</returns>
        public TraderPerformanceList GetTraderPerformanceOfLeague(GetTraderPerformanceOfLeagueCriteria criteria)
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
        /// Gets the match performance of a pair of league and trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceGroup object.</returns>
        public MatchPerformanceGroup GetMatchPerformanceOfLeagueTrader(GetMatchPerformanceOfLeagueTraderCriteria criteria)
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
        /// Gets the bet type detail from league report.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of bet type detail objects.</returns>
        public IEnumerable<BetTypeDetailItem> GetBettypeDetailLeague(GetBettypeDetailLeague criteria)
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
        /// Gets the match performance of league.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceGroup object.</returns>
        public MatchPerformanceGroup GetMatchPerformanceOfLeague(GetMatchPerformanceOfLeagueCriteria criteria)
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
        /// Gets the bettype performance of pair a of league and match.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceGroup object.</returns>
        public IEnumerable<BetTypeDetailItem> GetBettypePerformanceOfLeagueMatch(GetBetTypePerformanceOfLeagueMatchCriteria criteria)
        {
            IEnumerable<BetTypeDetailInfo> bettypeData = this.GetData<BetTypeDetailInfo>(criteria);
            List<BetTypeDetailItem> bettypePerformance = new List<BetTypeDetailItem>();            

            if (bettypeData != null && bettypeData.Any())
            {
                foreach (BetTypeDetailInfo item in bettypeData)
                {
                    bettypePerformance.Add(new BetTypeDetailItem(item));
                }
            }

            return bettypePerformance;
        }

        /// <summary>
        /// Export League Performance to excel.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="templatePath">Path to Excel template file.</param>
        public void ExportLeaguePerformance(int userId, GetLeaguePerformanceCriteria criteria, string templatePath)
        {
            LeaguePerformanceList leagueData = SessionManager.Get<LeaguePerformanceList>(LeaguePerformanceDetailReportSessionKey);

            if ((leagueData != null) && (leagueData.ItemByOrderList.Count > 0 || leagueData.ItemLiveList.Count > 0 || leagueData.ItemNonLiveList.Count > 0))
            {
                string reportName = string.Format(
                                ViewLang.PerformanceDetailFileName,
                                ViewLang.League,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());
                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.LeaguePerformance);
                writer.CopyRows(0, 1);

                FilterBlock(userId, criteria, ref writer);

                var rowHeader = writer.CopyRows(3, 2);               

                //writer.FreezeRow(0, 3);

                FillRowData(leagueData, criteria, ref writer);

                if (!criteria.IsVirtual && criteria.IsReal)
                {
                    var cellHeader = rowHeader.GetCell(6);

                    cellHeader.SetCellValue("Real");
                }

                if (criteria.IsVirtual && criteria.IsReal)
                    writer.SyncColumnsWidth(14);
                else
                    writer.SyncColumnsWidth(10);

                writer.Render();
            }
        }

        /// <summary>
        /// Calculates the total margin.
        /// </summary>
        /// <param name="winLoss">The win loss.</param>
        /// <param name="turnover">The turnover.</param>
        /// <returns>The margin value.</returns>
        private decimal? CalculateTotalMargin(decimal winLoss, decimal turnover)
        {
            decimal? margin = null;

            if (turnover != 0)
            {
                margin = winLoss / turnover * 100;
            }

            return margin;
        }

        /// <summary>
        /// Fills the header.
        /// </summary>
        /// <param name="writer">The writer that is used to write Excel content.</param>
        private void FillHeader(ref ExcelTemplateWriter writer)
        {
            writer.CopyRows(3, 1);
        }

        /// <summary>
        /// Generate bet type string.
        /// </summary>
        /// <param name="data">List of all bet types.</param>
        /// <param name="betTypes">String contains criteria's bet types id.</param>
        /// <returns>Bet type string.</returns>
        private string MakeBetTypeSelectString(List<BetTypeItem> data, string betTypes)
        {
            if (string.IsNullOrEmpty(betTypes) || betTypes == "0")
            {
                return string.Join(", ", data.Select(obj => obj.BetTypeName));
            }
            else
            {
                var betTypeList = betTypes.Split(',').Select(int.Parse).ToList();

                var result = data.Join(betTypeList, b1 => b1.BetTypeId, b2 => b2,
                                    (b1, b2) => new { b1.BetTypeName }).Select(x => x.BetTypeName);

                return string.Join(", ", result);
            }
        }

        private string MakeLeagueGroupSelectString(string leagueGroupIds)
        {
            var leagueGroupNames = string.Empty;

            if (string.IsNullOrEmpty(leagueGroupIds))
                return leagueGroupNames;

            var leagueGroups = SessionManager.Get<List<LeagueGroup>>(LeagueGroupsSessionKey);

            if (leagueGroups == null || !leagueGroups.Any())
                return leagueGroupNames;

            var ids = leagueGroupIds.Split(',');

            foreach (var id in ids)
            {
                var group = leagueGroups
                .Where(x => x.LeagueGroupId.ToString().Equals(id))
                .Select(x => x.LeagueGroupName).ToList();

                if (group != null && group.Any())
                {
                    leagueGroupNames += group[0] + ", ";
                }
            }

            leagueGroupNames = leagueGroupNames.TrimEnd(new char[] { ' ', ',' });

            return leagueGroupNames;
        }

        /// <summary>
        /// Fills the content row.
        /// </summary>
        /// <param name="contentData">The content data.</param>
        /// <param name="writer">The writer that is used to write Excel content.</param>
        private void FillRowData(LeaguePerformanceList data, GetLeaguePerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            // Content rows
            LeaguePerformanceItem item;

            var contentData = criteria.Market == -1 ? data.ItemByOrderList : (criteria.Market == 1 ? data.ItemLiveList : data.ItemNonLiveList);
            int len = contentData.Count;
            var leagueId = contentData[0].LeagueId;
            var leagueCounter = 1;

            for (int i = 0; i < len; i++)
            {
                item = contentData[i];

                if(item.LeagueId != leagueId)
                {
                    leagueCounter++;
                    leagueId = item.LeagueId;
                }

                int styleIndex = leagueCounter % 2 == 0 ? 5 : 6;                     

                var record = new List<object>
                {
                     i + 1,
                    item.LeagueName,
                    item.IsLive ? ViewLang.MarketLive : ViewLang.MarketNonLive,
                    item.NoOfTraders,
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
                var totalRecord = CreateRecordTotalLeague(ref writer, data.TotalItemLive, criteria, ViewLang.GrandTotal, true);

                writer.WriteRow(7, totalRecord.ToArray());

                totalRecord = CreateRecordTotalLeague(ref writer, data.TotalItemNonLive, criteria, null, false);

                writer.WriteRow(8, totalRecord.ToArray());
            }
            else
            {
                var totalRecord = CreateRecordTotalLeague(ref writer, data.Total, criteria, ViewLang.GrandTotal, criteria.Market == 1);

                writer.WriteRow(7, totalRecord.ToArray());
            }
        }

        private List<object> CreateRecordTotalLeague(ref ExcelTemplateWriter writer, LeaguePerformanceItem total, GetLeaguePerformanceCriteria criteria, string grandTotal, bool isLive)
        {
            var record = new List<object>
                {
                    grandTotal,
                    null,
                    isLive ? ViewLang.MarketLive : ViewLang.MarketNonLive,
                    total.NoOfTraders,
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
        /// Append formatted block to the given rich text render.
        /// </summary>
        /// <param name="content">The rich text render object to append.</param>
        /// <param name="lineCount">Content's line count.</param>
        /// <param name="name">Name part of append block.</param>
        /// <param name="nameFont">Font of name part.</param>
        /// <param name="value">Value part of append block.</param>
        /// <param name="valueFont">Font of value part.</param>
        /// <param name="endString">End string.</param>
        private void AppendBlockContent(ref RichTextRender content, ref int lineCount, string name, IFont nameFont, string value, IFont valueFont, string endString)
        {
            if (string.IsNullOrEmpty(value))
            {
                return;
            }

            // Name
            TextBlock nameBlock = new TextBlock(name + ":  ", nameFont);
            content = content.AddText(nameBlock);

            // Value
            TextBlock valueBlock = new TextBlock(value, valueFont);
            content = content.AddText(valueBlock);

            if (!string.IsNullOrEmpty(endString))
            {
                content = content.AddText(endString);
            }

            lineCount += CountLine(name + value);
        }

        private int CountLine(string line)
        {
            int charPerLine = 216; // Number char per line in filter block - use to calculate number of line
            return Convert.ToInt32(Math.Ceiling((float)line.Length / charPerLine));
        }

        /// <summary>
        /// Make Filter row.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="writer">The writer that is used to write Excel content.</param>
        [SuppressMessage("StyleCop.CSharp.StylecopPlus.Rules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Need to review here.")]
        private void FilterBlock(int userId, GetLeaguePerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            RichTextRender contentRender = new RichTextRender().Clear();
            IFont boldFont = writer.GetFont(11, 0);
            IFont normalFont = writer.GetFont(12, 0);
            int lineCount = 0;

            var permission = (PermissionCheck == null) ? BettypeViewPermission.All : ReportUtil.GetBettypePermission(PermissionCheck);
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
                string winlossString = (criteria.WinLoss != null) ? criteria.WinLoss.Format(2) : string.Empty;

                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MinimumVirtualTurnover, boldFont, turnoverString, normalFont, "\n");
                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MinimumVirtualWinLoss, boldFont, winlossString, normalFont, "\n");

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
            
            string leagueString = (criteria.LeagueName != null) ? string.Format("contains '{0}'", criteria.LeagueName) : string.Empty;
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.League, boldFont, leagueString, normalFont, "\n");

            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(9, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }
    }
}