namespace Fanex.MAP.TGRS.WebAPI.Service
{
    using Fanex.Data;
    using Fanex.MAP.TGRS.WebAPI.Consts;
    using Fanex.MAP.TGRS.WebAPI.Criteria.AutoTrading;    
    using Fanex.MAP.TGRS.WebAPI.Model.DataModel.AutoTrading;
    using Fanex.MAP.TGRS.WebAPI.Model.HtmlModel.AutoTrading;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;    
    using System.IO;
    using System.Linq;    

    public class AutoTradingPerformanceService : IAutoTradingPerformanceService
    {
        private string _leagueGroupIds = "1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11";
        private string _typeSiteIds = "2, 3";
        private DateTime _taLauchedDate = new DateTime(2019, 11, 7);
        private DateTime _ptAfterIncreaseVarianceDate = new DateTime(2019, 10, 19);

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

            GetAutoTradingEventRT3Performance(titleModelRT3, writer);

            writer.GenerateEmptyRows();
            GetAutoTradingEventTAPerformance(criteria, leagueGroupList, titleModelTA, writer);

            writer.GenerateEndTagHtmlBody();

            return writer.ConvertHtmlToBytes();
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
                            var summaryMonthlyInfo = summaryMonthlyData.FirstOrDefault(x => x.RptMonth == group.RptMonth);
                            
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

        private void GetAutoTradingEventRT3Performance(string title, IAutoTradingHtmlWriter writer)
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

            return sundayOfLastWeek.AddDays(-28);
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