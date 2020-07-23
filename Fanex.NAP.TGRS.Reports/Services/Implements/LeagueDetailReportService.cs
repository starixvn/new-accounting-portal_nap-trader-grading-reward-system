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
            var leagueGroupList = new List<LeagueGroup> {
                new LeagueGroup { LeagueGroupId = 1, LeagueGroupName = "Major" },
                new LeagueGroup { LeagueGroupId = 2, LeagueGroupName = "Minor 1" },
                new LeagueGroup { LeagueGroupId = 3, LeagueGroupName = "Minor 2" },
                new LeagueGroup { LeagueGroupId = 4, LeagueGroupName = "Minor 3" },
                new LeagueGroup { LeagueGroupId = 5, LeagueGroupName = "Minor 4" },
                new LeagueGroup { LeagueGroupId = 6, LeagueGroupName = "Others" },
                new LeagueGroup { LeagueGroupId = 7, LeagueGroupName = "Others 1" },
                new LeagueGroup { LeagueGroupId = 8, LeagueGroupName = "Others 2" },
                new LeagueGroup { LeagueGroupId = 9, LeagueGroupName = "Others 3" },
                new LeagueGroup { LeagueGroupId = 10, LeagueGroupName = "Others 4" },
                new LeagueGroup { LeagueGroupId = 11, LeagueGroupName = "Others 5" },
                new LeagueGroup { LeagueGroupId = 12, LeagueGroupName = "Other Groups" }
            };

            SessionManager.Set<List<LeagueGroup>>(LeagueGroupsSessionKey, leagueGroupList);

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
                                BetCount = c.BetCount,
                                Margin = c.Margin,
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
                        IsExcludeLeagues = AppSession.IsExcludingLeagues
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
                FillHeader(ref writer);
                writer.FreezeRow(0, 3);
                FillRowData(leagueData, criteria.Market, ref writer);

                writer.SyncColumnsWidth(9);
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
            if (betTypes == "0")
            {
                return string.Join(", ", data.Select(obj => obj.BetTypeName));
            }
            else
            {
                return string.Join(", ", data.Where(obj => betTypes.Contains(obj.BetTypeId.ToString())).Select(obj => obj.BetTypeName));
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
        private void FillRowData(LeaguePerformanceList data, short market, ref ExcelTemplateWriter writer)
        {
            // Content rows
            LeaguePerformanceItem item;

            var contentData = market == -1 ? data.ItemByOrderList : (market == 1 ? data.ItemLiveList : data.ItemNonLiveList);
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

                int styleIndex = leagueCounter % 2 == 0 ? 4 : 5;

                var record = new object[]
                {
                    i + 1,
                    item.LeagueName,
                    item.IsLive ? ViewLang.MarketLive : ViewLang.MarketNonLive,
                    item.NoOfTraders,
                    item.NoOfMatches,
                    item.Turnover,
                    item.Turnover / item.NoOfMatches,
                    item.WinLoss,
                    item.BetCount,
                    (object)item.Margin ?? ViewLang.NA,
                };

                writer.WriteRow(styleIndex, record);
            }

            if (market == -1)
            {
                // Total row
                LeaguePerformanceItem total = data.TotalItemLive;
                var totalRecord = new object[]
                {
                    ViewLang.GrandTotal,
                    null,
                    ViewLang.MarketLive,
                    total.NoOfTraders,
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
                LeaguePerformanceItem total = data.Total;
                var totalRecord = new object[]
                {
                    ViewLang.GrandTotal,
                    null,
                    market == 1 ? ViewLang.MarketLive : ViewLang.MarketNonLive,
                    total.NoOfTraders,
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
            IFont boldFont = writer.GetFont(10, 0);
            IFont normalFont = writer.GetFont(11, 0);
            int lineCount = 0;

            var permission = (PermissionCheck == null) ? BettypeViewPermission.All : ReportUtil.GetBettypePermission(PermissionCheck);
            List<BetTypeItem> betTypes = this.GetBetTypes(userId, permission).ToList();
            string betTypeString = MakeBetTypeSelectString(betTypes, criteria.BetTypes);
            string turnoverString = (criteria.Turnover != null) ? criteria.Turnover.Format(2) : string.Empty;
            string winlossString = (criteria.WinLoss != null) ? criteria.WinLoss.Format(2) : string.Empty;
            string marketString = criteria.Market == -1 ? ViewLang.MarketAll : (criteria.Market == 1 ? ViewLang.MarketLive : ViewLang.MarketNonLive);
            var leagueGroupNameString = MakeLeagueGroupSelectString(criteria.LeagueGroupIds);

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Market, boldFont, marketString, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.BetType, boldFont, betTypeString, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MinimumTurnover, boldFont, turnoverString, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MinimumWinLoss, boldFont, winlossString, normalFont, "\n");
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

            //// League
            string leagueString = (criteria.LeagueName != null) ? string.Format("contains '{0}'", criteria.LeagueName) : string.Empty;
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.League, boldFont, leagueString, normalFont, "\n");

            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(8, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }
    }
}