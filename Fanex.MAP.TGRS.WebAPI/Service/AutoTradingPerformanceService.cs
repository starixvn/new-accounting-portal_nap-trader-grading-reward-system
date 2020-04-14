namespace Fanex.MAP.TGRS.WebAPI.Service
{
    using Fanex.Data;
    using Fanex.MAP.TGRS.WebAPI.Consts;
    using Fanex.MAP.TGRS.WebAPI.Criteria.AutoTrading;
    using Fanex.MAP.TGRS.WebAPI.Model.DataModel.AutoTrading;
    using Fanex.MAP.TGRS.WebAPI.Model.HtmlModel.AutoTrading;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class AutoTradingPerformanceService
    {
        private const string SaveImagePath = @"C:\TGR Test\Test.Png";
        private IAutoTradingHtmlWriter writer;

        public void GetAutoTradingPerformance()
        {
            writer = new AutoTradingHtmlWriter();

            GetAutoTradingMonthlyPerformance(GenerateMonthlyPerformanceCriteria());
            //GetAutoTradingWeeklyPerformance(GenerateWeeklyPerformanceCriteria());
            //GetAutoTradingEventPerformance(GenerateEventPerformanceCriteria());

            writer.RenderHtmlToImage(SaveImagePath);
        }

        private GetAutoTradingMonthlyPerformanceCriteria GenerateMonthlyPerformanceCriteria()
        {
            return new GetAutoTradingMonthlyPerformanceCriteria
            {
                FromDate = new DateTime(2020, 01, 01),
                ToDate = new DateTime(2020, 04, 01),
                LeagueGroupIds = "1, 2, 3, 4, 5, 6",
                TypeSiteIds = "2, 3",
                Model = 3
            };
        }

        public void GetAutoTradingMonthlyPerformance(GetAutoTradingMonthlyPerformanceCriteria criteria)
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
                                               .Aggregate<AutoTradingSummaryMonthlyInfo, AutoTradingSummaryMonthlyInfo>(null, (acc, s) => acc + s);                        

                        writer.GenerateBeginTagHtmlBody()
                              .GenerateTable(title);

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

        private GetAutoTradingWeeklyPerformanceCriteria GenerateWeeklyPerformanceCriteria()
        {
            return new GetAutoTradingWeeklyPerformanceCriteria
            {
                FromDate = new DateTime(2020, 01, 01),
                ToDate = new DateTime(2020, 04, 01),
                LeagueGroupIds = "1, 2, 3, 4, 5, 6",
                TypeSiteIds = "2, 3",
                Model = 3
            };
        }

        public void GetAutoTradingWeeklyPerformance(GetAutoTradingWeeklyPerformanceCriteria criteria)
        {
            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    multi.Read<object>();
                    var summaryWeeklyData = multi.Read< AutoTradingSummaryWeeklyInfo>();

                    multi.Read<object>();
                    var weeklyData = multi.Read<AutoTradingWeeklyPerformanceInfo>();

                    if (summaryWeeklyData != null && summaryWeeklyData.Any())
                    {
                        var title = "TA NO TRADER PERFORMANCE WEEKLY REPORT";

                       // writer.GenerateTable(title);
                    }
                }
            }
        }
       
        private GetAutoTradingEventPerformanceCriteria GenerateEventPerformanceCriteria()
        {
            return new GetAutoTradingEventPerformanceCriteria
            {
                FromDate = new DateTime(2020, 01, 01),
                ToDate = new DateTime(2020, 04, 01),
                TypeSiteIds = "2, 3",
                Model = 3
            };
        }

        public void GetAutoTradingEventPerformance(GetAutoTradingEventPerformanceCriteria criteria)
        {

        }
    }
}