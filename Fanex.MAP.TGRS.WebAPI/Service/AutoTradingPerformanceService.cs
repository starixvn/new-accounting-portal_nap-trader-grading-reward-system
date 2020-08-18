namespace Fanex.MAP.TGRS.WebAPI.Service
{
    using Fanex.Data;
    using Fanex.MAP.TGRS.WebAPI.Criteria.AutoTrading;
    using Fanex.MAP.TGRS.WebAPI.Model.DataModel.AutoTrading;
    using Fanex.MAP.TGRS.WebAPI.Model.HtmlModel.AutoTrading;
    using Fanex.NAP.TGRS.Core.Consts;
    using Fanex.NAP.TGRS.Core.ExcelUtility;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;

    public class AutoTradingPerformanceService : IAutoTradingPerformanceService
    {
        #region properties
        private string _leagueGroupIds = "1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11";
        private string _typeSiteIds = "2, 3";
        private DateTime _taLauchedDate = new DateTime(2019, 11, 7);
        private DateTime _ptAfterIncreaseVarianceDate = new DateTime(2019, 10, 19);
        #endregion

        public byte[] GetAutoTradingTAMonthly()
        {
            var criteria = new GetAutoTradingMonthlyPerformanceCriteria
            {
                FromDate = _taLauchedDate,
                ToDate = GetSundayOfLastWeek(),
                LeagueGroupIds = _leagueGroupIds,
                TypeSiteIds = _typeSiteIds,
                Model = 3 // TA
            };

            IAutoTradingHtmlWriter writer = new AutoTradingHtmlWriter();

            GetAutoTradingMonthlyPerformance(criteria, writer);

            return writer.ConvertHtmlToBytes();
        }

        public byte[] GetAutoTradingPTAndAfterVRAdjustment()
        {
            var titleTaNoTrader = "TA WIN-LOSS REPORT NO TRADER PERFORMANCE";
            var titleLastWeeks = "TA LAST 4 WEEK WIN-LOSS REPORT";

            var criteria = new GetAutoTradingWeeklyPerformanceCriteria
            {
                FromDate = _ptAfterIncreaseVarianceDate,
                ToDate = GetSundayOfLastWeek(),
                LeagueGroupIds = _leagueGroupIds,
                TypeSiteIds = _typeSiteIds,
                Model = 3 // TA
            };

            IAutoTradingHtmlWriter writer = new AutoTradingHtmlWriter();

            writer.GenerateBeginTagHtmlBody();
            GetAutoTradingTimelinePerformance(criteria, titleTaNoTrader, writer);

            writer.GenerateEmptyRows();
            criteria.FromDate = GetDateOfFourLastWeek();
            criteria.ToDate = GetSundayOfLastWeek();
            GetAutoTradingWeeklyPerformance(criteria, titleLastWeeks, writer);

            writer.GenerateEndTagHtmlBody();

            return writer.ConvertHtmlToBytes();
        }

        public byte[] GetAutoTradingRT3AndTAComparition()
        {
            var titleModelRT3 = "RT3 WIN-LOSS WITH TRADER PERFORMANCE (BY LEAGUE GROUP)";
            var titleModelTA = "TA WIN-LOSS NO TRADER PERFORMANCE (BY LEAGUE GROUP)";
            var criteria = new GetAutoTradingEventPerformanceCriteria
            {
                FromDate = _taLauchedDate,
                ToDate = GetSundayOfLastWeek(),
                TypeSiteIds = _typeSiteIds,
                Model = 3 // TA
            };

            IAutoTradingHtmlWriter writer = new AutoTradingHtmlWriter();

            var leagueGroupList = GetLeagueGroupList();
            writer.GenerateBeginTagHtmlBody();

            GetAutoTradingEventRT3PerformanceFixed(titleModelRT3, writer);

            writer.GenerateEmptyRows();
            GetAutoTradingEventTAPerformance(criteria, leagueGroupList, titleModelTA, writer);

            writer.GenerateEndTagHtmlBody();

            return writer.ConvertHtmlToBytes();
        }

        public byte[] GetAutoTradingEventLeaguesExcel(string templatePath)
        {
            var criteria = new GetAutoTradingEventLeaguesPerformanceCriteria
            {
                FromDate = _taLauchedDate,
                ToDate = GetSundayOfLastWeek(),
                TypeSiteIds = _typeSiteIds,
                Model = 3, // TA
                IsExportExcel = true
            };

            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    var summaryLeagueData = multi.Read<AutoTradingSummaryEventLeaguesInfo>();

                    var leagueData = multi.Read<AutoTradingEventLeaguesPerformanceInfo>();

                    if (summaryLeagueData != null && summaryLeagueData.Any())
                    {
                        return GenerateAutoTradingEventLeaguesExcel(summaryLeagueData, leagueData, criteria, templatePath);
                    }
                }
            }

            return new byte[0];
        }

        public byte[] GenerateAutoTradingEventLeaguesExcel(IEnumerable<AutoTradingSummaryEventLeaguesInfo> summaryEventLeagueList
            , IEnumerable<AutoTradingEventLeaguesPerformanceInfo> eventLeagueList
            , GetAutoTradingEventLeaguesPerformanceCriteria criteria
            , string templatePath)
        {
            var writer = new ExcelTemplateWriter(templatePath, "", "TA Report");
            var sheet = writer.CopyRows(0, 1).Sheet;
            var rangeDate = "TA Performance - Event Details "
                            + criteria.FromDate.ToString(Consts.FormatDateTimeToString_ddMMMyyyy)
                            + " - "
                            + criteria.ToDate.ToString(Consts.FormatDateTimeToString_ddMMMyyyy);

            writer.WriteRow(1, new object[] { rangeDate });
            writer.CopyRows(2, 2);
            var rowStartNum = 5;
            var rowEndNum = 5;

            var eventGroupInfos = summaryEventLeagueList
                                    .OrderBy(x => x.LeagueGroupId)
                                    .GroupBy(x => x.LeagueGroupId, (key, g) => new { LeagueGroupId = key, ItemList = g.ToList() });           

            foreach (var grouping in eventGroupInfos)
            {
                var eventLeague = GetLeagueGroupList().FirstOrDefault(x => x.Key.Equals(grouping.LeagueGroupId));

                var groupTotalLeagueInfo = eventLeagueList
                                        .Where(x => x.LeagueGroupId.Equals(grouping.LeagueGroupId))
                                        .Aggregate<AutoTradingModelPerformanceInfo, AutoTradingModelPerformanceInfo>(null, (acc, s) => acc + s);

                var groupMatchCount = grouping.ItemList.Sum(x => x.MatchCount);

                FillRowDataEventLeague(eventLeague.Value, groupMatchCount, groupTotalLeagueInfo, 5, ref writer);

                var similarLeagueNames = GetEventSimilarLeagueName(grouping.ItemList);
                var skipSimilarLeagues = 0;

                foreach (var leagueList in grouping.ItemList)
                {
                    var similarLeague = CheckExistSimilarLeague(similarLeagueNames, leagueList.LeagueId);

                    if (similarLeague == null)
                    {
                        var matchCount = summaryEventLeagueList.FirstOrDefault(x => x.LeagueId.Equals(leagueList.LeagueId)).MatchCount;
                        var leagueInfo = eventLeagueList.Where(x => x.LeagueId.Equals(leagueList.LeagueId))
                                                    .Aggregate<AutoTradingModelPerformanceInfo, AutoTradingModelPerformanceInfo>(null, (acc, s) => acc + s);

                        FillRowDataEventLeague(leagueList.LeagueName, matchCount, leagueInfo, 4, ref writer);
                    }
                    else
                    {
                        if (similarLeague.IsMerged)
                        {
                            skipSimilarLeagues += 1;
                            continue;
                        }
                            
                        var matchCount = summaryEventLeagueList.Where(x => similarLeague.LeagueIdList.Contains(x.LeagueId)).Sum(x => x.MatchCount);
                        var leagueInfo = eventLeagueList.Where(x => similarLeague.LeagueIdList.Contains(x.LeagueId))
                                                    .Aggregate<AutoTradingModelPerformanceInfo, AutoTradingModelPerformanceInfo>(null, (acc, s) => acc + s);

                        FillRowDataEventLeague(similarLeague.LeagueName, matchCount, leagueInfo, 4, ref writer);
                        MergedSimilarLeague(similarLeagueNames, similarLeague.LeagueName);
                    }
                }

                rowEndNum = rowStartNum + (grouping.ItemList.Count - skipSimilarLeagues) - 1;                
                sheet.GroupRow(rowStartNum, rowEndNum);
                sheet.SetRowGroupCollapsed(rowStartNum, true);

                rowStartNum = rowEndNum + 2;
            }

            var grandTotalInfo = eventLeagueList.Aggregate<AutoTradingModelPerformanceInfo, AutoTradingModelPerformanceInfo>(null, (acc, s) => acc + s);

            var grandTotalMatchCount = summaryEventLeagueList.Sum(x => x.MatchCount);

            FillRowDataEventLeague("Overall", grandTotalMatchCount, grandTotalInfo, 6, ref writer);

            writer.SyncColumnsWidth(18);

            return writer.ToBytes();
        }

        private void FillRowDataEventLeague(string autoTradingName, int matchCount, AutoTradingModelPerformanceInfo info, int styleIndex, ref ExcelTemplateWriter writer)
        {
            var record = new object[]
               {
                    autoTradingName,
                    matchCount,
                    // Variance
                    info.Stake_VAR, info.Winloss_VAR, info.Margin_VAR/100,
                    // Real total
                    info.Stake_AR, info.Winloss_AR, info.Margin_AR/100,
                    // Virtual total
                    info.Stake_VR, info.WinLoss_VR, info.Margin_VR/100,
                    // 8RM total
                    string.Empty, info.Winloss_8RM, string.Empty,
                    // Real total 8RM WL
                    info.Stake_AR8RM, info.Winloss_AR8RM, info.Margin_AR8RM/100,
                    info.BetCount
                };

            writer.WriteRow(styleIndex, record);
        }

        private List<AutoTradingSimilarLeagueName> GetEventSimilarLeagueName(List<AutoTradingSummaryEventLeaguesInfo> eventLeagueList)
        {
            var leagues = new List<AutoTradingSimilarLeagueName>();

            var leaguePlayOff = eventLeagueList.Where(x => x.LeagueName.ToUpper().Contains(Consts.AutomationTradingLeagueNamePlayOff));

            foreach (var info in leaguePlayOff)
            {
                var leagueName = info.LeagueName.Substring(0, info.LeagueName.Length - Consts.AutomationTradingLeagueNamePlayOff.Length - 1);

                var sameLeagues = eventLeagueList.Where(x => x.LeagueName.Contains(leagueName));

                leagues.Add(new AutoTradingSimilarLeagueName
                {
                    LeagueIdList = sameLeagues.Select(x => x.LeagueId).ToList(),
                    LeagueName = leagueName,
                    LeagueNameOther = info.LeagueName
                });
            }

            return leagues;
        }

        private AutoTradingSimilarLeagueName CheckExistSimilarLeague(List<AutoTradingSimilarLeagueName> similarLeagueNames, int leagueId)
        {
            return similarLeagueNames.AsEnumerable().FirstOrDefault(x => x.LeagueIdList.Contains(leagueId));
        }

        private List<AutoTradingSimilarLeagueName> MergedSimilarLeague(List<AutoTradingSimilarLeagueName> similarLeagueNames, string leagueName)
        {
            foreach (var league in similarLeagueNames)
            {
                if (league.LeagueName.Equals(leagueName))
                {
                    league.IsMerged = true;
                    break;
                }
            }

            return similarLeagueNames;
        }

        private void GetAutoTradingMonthlyPerformance(GetAutoTradingMonthlyPerformanceCriteria criteria, IAutoTradingHtmlWriter writer)
        {
            var title = "TA NO TRADER PERFORMANCE MONTHLY REPORT";

            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    multi.Read<object>();
                    var summaryMonthlyData = multi.Read<AutoTradingSummaryMonthlyInfo>();

                    multi.Read<object>();
                    var monthlyData = multi.Read<AutoTradingMonthlyPerformanceInfo>();

                    if (summaryMonthlyData != null && summaryMonthlyData.Any())
                    {
                        var grandTotalSummary = summaryMonthlyData
                                               .Aggregate<AutoTradingSummaryInfo, AutoTradingSummaryInfo>(null, (acc, s) => acc + s);

                        writer.GenerateBeginTagHtmlBody()
                               .GenerateTable(title, "Month");

                        var groupInfos = monthlyData
                                .OrderBy(x => x.RptMonth)
                                .GroupBy(x => x.RptMonth, (key, g) => new { RptMonth = key, Items = g.ToList() });

                        foreach (var group in groupInfos)
                        {
                            var rptMonth = BackToBeginningOfTheMonth(group.RptMonth);

                            var summaryMonthlyInfo = summaryMonthlyData.FirstOrDefault(x => x.RptMonth.Equals(rptMonth));

                            var autoTradingName = "TA - " + group.RptMonth.ToString(Consts.FormatDateTimeToString_MMMyyyy);

                            writer.GenerateTableTr(group.Items, summaryMonthlyInfo, autoTradingName);
                        }

                        writer.GenerateGrandTotalTableTr(monthlyData, grandTotalSummary, "TA - Total")
                               .RenderControlTable()
                               .GenerateEndTagHtmlBody();
                    }
                }
            }
        }

        private DateTime BackToBeginningOfTheMonth(DateTime rptMonth)
        {
            if (rptMonth.Day.Equals(1))
            {
                return rptMonth;
            }

            return new DateTime(rptMonth.Year, rptMonth.Month, 1);
        }

        private void GetAutoTradingTimelinePerformance(GetAutoTradingWeeklyPerformanceCriteria criteria, string title, IAutoTradingHtmlWriter writer)
        {
            var autoTradingTimelineInfo = GetAutoTradingTimelineInfos();

            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    multi.Read<object>();
                    var summaryWeeklyData = multi.Read<AutoTradingSummaryWeeklyInfo>();

                    multi.Read<object>();
                    var weeklyData = multi.Read<AutoTradingWeeklyPerformanceInfo>();

                    if (summaryWeeklyData != null && summaryWeeklyData.Any())
                    {
                        var grandTotalSummary = summaryWeeklyData
                                               .Aggregate<AutoTradingSummaryInfo, AutoTradingSummaryInfo>(null, (acc, s) => acc + s);

                        writer.GenerateBeginTagHtmlBody()
                              .GenerateTable(title, "Timeline", true);

                        if (autoTradingTimelineInfo != null)
                        {
                            var timelinePTInfoList = new List<AutoTradingPTPerformanceInfo>
                            {
                                autoTradingTimelineInfo.RT3BeforePT85,
                                autoTradingTimelineInfo.RT3AfterPT85,
                                autoTradingTimelineInfo.RT3IncreaseVariancePT
                            };
                            writer.GenerateRT3PTTableTr(timelinePTInfoList);
                        }

                        var autoTradingName = "TA After PT 85 & increase Variance PT";
                        writer.GenerateHeaderEmptyGrandTotalTableTr(weeklyData, grandTotalSummary, autoTradingName)
                              .RenderControlTable();
                    }
                }
            }
        }

        private AutoTradingTimelineInfo GetAutoTradingTimelineInfos()
        {
            Directory.SetCurrentDirectory(AppDomain.CurrentDomain.BaseDirectory);
            var json = File.ReadAllText("Model/DataModel/AutoTrading/AutoTradingTimelineFixed.json");

            return JsonConvert.DeserializeObject<AutoTradingTimelineInfo>(json);
        }

        private void GetAutoTradingWeeklyPerformance(GetAutoTradingWeeklyPerformanceCriteria criteria, string title, IAutoTradingHtmlWriter writer)
        {
            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    multi.Read<object>();
                    var summaryWeeklyData = multi.Read<AutoTradingSummaryWeeklyInfo>();

                    multi.Read<object>();
                    var weeklyData = multi.Read<AutoTradingWeeklyPerformanceInfo>();

                    if (summaryWeeklyData != null && summaryWeeklyData.Any())
                    {
                        writer.GenerateTable(title, "Week", true);

                        var groupInfos = weeklyData
                           .OrderBy(x => x.StartDate)
                           .GroupBy(x => x.WeekDays, (key, g) => new { WeekDays = key, Items = g.ToList() });

                        foreach (var group in groupInfos)
                        {
                            var summaryWeeklyInfo = summaryWeeklyData.FirstOrDefault(x => x.WeekDays == group.WeekDays);
                            var autoTradingName = "TA - " + GenerateWeekly(group.Items[0]);

                            writer.GenerateHeaderEmptyTableTr(group.Items, summaryWeeklyInfo, autoTradingName);
                        }

                        writer.RenderControlTable();
                    }
                }
            }
        }

        private string GenerateWeekly(AutoTradingWeeklyPerformanceInfo info)
        {
            var weekly = string.Empty;

            if (info.StartDate != null && info.StartDate != DateTime.MinValue)
            {
                weekly = info.StartDate.ToString(Consts.FormatDateTimeToString_ddMMM);
            }

            if (info.EndDate != null && info.EndDate != DateTime.MinValue)
            {
                weekly += " - " + info.EndDate.ToString(Consts.FormatDateTimeToString_ddMMM);
            }

            return weekly;
        }

        private void GetAutoTradingEventRT3PerformanceFixed(string title, IAutoTradingHtmlWriter writer)
        {
            Directory.SetCurrentDirectory(AppDomain.CurrentDomain.BaseDirectory);
            var json = File.ReadAllText("Model/DataModel/AutoTrading/AutoTradingEventRT3Fixed.json");
            var eventRT3Info = JsonConvert.DeserializeObject<AutoTradingEventRT3Info>(json);

            if (eventRT3Info != null)
            {
                var eventRT3List = new List<AutoTradingPTPerformanceInfo>
                            {
                                eventRT3Info.MajorLeague,
                                eventRT3Info.Minor1,
                                eventRT3Info.Minor2,
                                eventRT3Info.Minor3,
                                eventRT3Info.Minor4,
                                eventRT3Info.Other1,
                                eventRT3Info.Total
                            };

                writer.GenerateBeginTagHtmlBody()
                      .GenerateTable(title, "Group", true)
                      .GenerateEventRT3PTTableTr(eventRT3List)
                      .RenderControlTable();
            }
        }

        private void GetAutoTradingEventTAPerformance(GetAutoTradingEventPerformanceCriteria criteria, Dictionary<int, string> leagueGroupList, string title, IAutoTradingHtmlWriter writer)
        {
            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    multi.Read<object>();
                    var summaryEventData = multi.Read<AutoTradingSummaryEventInfo>();

                    multi.Read<object>();
                    var eventData = multi.Read<AutoTradingEventPerformanceInfo>();

                    if (summaryEventData != null && summaryEventData.Any())
                    {
                        var grandTotalSummary = summaryEventData
                                    .Aggregate<AutoTradingSummaryInfo, AutoTradingSummaryInfo>(null, (acc, s) => acc + s);

                        writer.GenerateTable(title, "Group");

                        var groupInfos = eventData
                                .OrderBy(x => x.LeagueGroupId)
                                .GroupBy(x => x.LeagueGroupId, (key, g) => new { LeagueGroupId = key, Items = g.ToList() });

                        foreach (var group in groupInfos)
                        {
                            var summaryMonthlyInfo = summaryEventData.FirstOrDefault(x => x.LeagueGroupId == group.LeagueGroupId);

                            var autoTradingName = leagueGroupList[group.LeagueGroupId];

                            writer.GenerateTableTr(group.Items, summaryMonthlyInfo, autoTradingName);
                        }

                        writer.GenerateGrandTotalTableTr(eventData, grandTotalSummary, "Total")
                               .RenderControlTable();
                    }
                }
            }
        }

        private DateTime GetDateOfFourLastWeek()
        {
            var sundayOfLastWeek = GetSundayOfLastWeek();

            return sundayOfLastWeek.AddDays(-27);
        }

        private DateTime GetSundayOfLastWeek()
        {
            return DateTime.Now.AddDays(-(int)DateTime.Now.DayOfWeek);
        }

        private Dictionary<int, string> GetLeagueGroupList()
        {
            var leagueGroupList = new Dictionary<int, string>();
            leagueGroupList.Add(1, "Major League");
            leagueGroupList.Add(2, "Minor 1");
            leagueGroupList.Add(3, "Minor 2");
            leagueGroupList.Add(4, "Minor 3");
            leagueGroupList.Add(5, "Minor 4");
            leagueGroupList.Add(6, "Others");
            leagueGroupList.Add(7, "Others 1");
            leagueGroupList.Add(8, "Others 2");
            leagueGroupList.Add(9, "Others 3");
            leagueGroupList.Add(10, "Others 4");
            leagueGroupList.Add(11, "Others 5");

            return leagueGroupList;
        }

    }
}