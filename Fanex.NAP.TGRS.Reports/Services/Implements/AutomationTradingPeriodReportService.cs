namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.Data;
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Consts;
    using Fanex.NAP.TGRS.Core.ExcelUtility;
    using Fanex.NAP.TGRS.Core.ExcelUtility.RichTextExtensions;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Criteria.AutomationTradingPerformance;
    using Fanex.NAP.TGRS.Reports.Models.AutomationTradingPerformance;
    using Fanex.NAP.TGRS.Reports.ViewModels.AutomationTradingPerformance;
    using NPOI.SS.UserModel;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;

    public partial class AutomationTradingReportService : TGRSBaseService, IAutomationTradingReportService
    {
        #region Consts
        private const string AutomationTradingPeriodPerformanceSessionKey = "Fanex.NAP.TGRS.Reports.AutomationTradingPerformance.PeriodList";
        #endregion

        #region Period
        public AutoTradingList GetAutoTradingWeekPerformance(GetWeekPerformanceCriteria criteria)
        {
            var weekList = new AutoTradingList();

            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    var totalLeagueMatchData = multi.Read<TotalLeagueMatchInfo>();
                    var summaryWeekData = multi.Read<SummaryPeriodInfo>();
                    var totalWeekData = multi.Read<TotalPerformanceInfo>();
                    var weekData = multi.Read<WeekPerformanceInfo>();

                    if (totalLeagueMatchData != null && totalLeagueMatchData.Any())
                    {
                        weekList.GenerateLeagueMacthTotal(totalLeagueMatchData.ToList()[0])
                                .GenerateSummary(totalWeekData)
                                .GenerateGroupHeader(criteria.Measurements, criteria.TypeSiteIds)
                                .GenerateMeasurementHidden(criteria.MeasurementHides);

                        if (weekData != null && weekData.Any())
                        {
                            var siteIdList = Array.ConvertAll(criteria.TypeSiteIds.Split(','), x => int.Parse(x)).ToList();

                            var groupInfos = weekData
                                .OrderBy(x => x.StartDate)
                                .GroupBy(x => x.WeekDays, (key, g) => new { WeekDays = key, Items = g.ToList() });

                            foreach (var group in groupInfos)
                            {
                                var summaryPeriodInfo = summaryWeekData.FirstOrDefault(x => x.WeekDays == group.WeekDays);

                                weekList.AddAutoTradingItem(siteIdList, group.Items, summaryPeriodInfo, GeneratePeriod(group.Items[0]), AutoTradingType.PeriodWeek);
                            }

                            weekList.GenerateGrandTotal();
                        }

                        SessionManager.Set<AutoTradingList>(AutomationTradingPeriodPerformanceSessionKey, weekList);
                    }
                }
            }

            return weekList;
        }

        private string GeneratePeriod(WeekPerformanceInfo info)
        {
            var period = string.Empty;

            if (info.StartDate != null && info.StartDate != DateTime.MinValue)
            {
                period = info.StartDate.ToString(Consts.FormatDateTimeToString_ddMMMyyyy);
            }

            if (info.EndDate != null && info.EndDate != DateTime.MinValue)
            {
                period += " - " + info.EndDate.ToString(Consts.FormatDateTimeToString_ddMMMyyyy);
            }

            return period;
        }

        public AutoTradingList GetAutoTradingMonthPerformance(GetMonthPerformanceCriteria criteria)
        {
            var monthlyList = new AutoTradingList();

            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    var totalLeagueMatchData = multi.Read<TotalLeagueMatchInfo>();
                    var summaryMonthData = multi.Read<SummaryPeriodInfo>();
                    var totalMonthData = multi.Read<TotalPerformanceInfo>();
                    var monthlyData = multi.Read<MonthPerformanceInfo>();

                    if (totalLeagueMatchData != null && totalLeagueMatchData.Any())
                    {
                        monthlyList.GenerateLeagueMacthTotal(totalLeagueMatchData.ToList()[0])
                                   .GenerateSummary(totalMonthData)
                                   .GenerateGroupHeader(criteria.Measurements, criteria.TypeSiteIds)
                                   .GenerateMeasurementHidden(criteria.MeasurementHides);

                        if (monthlyData != null && monthlyData.Any())
                        {
                            var siteIdList = Array.ConvertAll(criteria.TypeSiteIds.Split(','), x => int.Parse(x)).ToList();

                            var groupInfos = monthlyData
                                .OrderBy(x => x.RptMonth)
                                .GroupBy(x => x.RptMonth, (key, g) => new { RptMonth = key, Items = g.ToList() });

                            foreach (var group in groupInfos)
                            {
                                var summaryPeriodInfo = summaryMonthData.FirstOrDefault(x => x.RptMonth == group.RptMonth);

                                monthlyList.AddAutoTradingItem(siteIdList, group.Items, summaryPeriodInfo, group.RptMonth.ToString(Consts.FormatDateTimeToString_yyyyMMdd), AutoTradingType.PeriodMonth);
                            }

                            monthlyList.GenerateGrandTotal();
                        }

                        SessionManager.Set<AutoTradingList>(AutomationTradingPeriodPerformanceSessionKey, monthlyList);
                    }
                }
            }

            return monthlyList;
        }

        public void ExportAutoTradingPeriodPerformance(int userId, GetMonthPerformanceCriteria criteria, string templatePath)
        {
            var periodData = SessionManager.Get<AutoTradingList>(AutomationTradingPeriodPerformanceSessionKey);

            if (periodData != null && periodData.ItemList.Any())
            {
                string reportName = string.Format(
                                ViewLang.AutomationTradingPerformanceFileName,
                                ViewLang.Period,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());

                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.Period);
                var sheet = writer.CopyRows(0, 1).Sheet;

                var columns = new List<object>
                {
                    ViewLang.Period,
                    ViewLang.League,
                    ViewLang.Match,
                    ViewLang.BetCount
                };

                FilterBlockPeriod(userId, criteria, ref writer);

                writer.FreezeRow(0, 4);

                FillGroupHeader(periodData.GroupHeaderList, periodData.GrandTotal.RobotTradingItemList, columns, 4, ref writer);
                FillRowData(periodData.ItemList, 4, ref writer);
                FillGrandTotal(periodData.GrandTotal, 4, ref writer);

                // Adjust column width for sheet
                sheet.SetColumnWidth(0, 6144);
                for (int i = 1; i < columns.Count; i++)
                {
                    sheet.SetColumnWidth(i, 4096);
                }

                writer.Render();
            }
        }

        [SuppressMessage("StyleCop.CSharp.StylecopPlus.Rules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Need to review here.")]
        private void FilterBlockPeriod(int userId, GetMonthPerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            RichTextRender contentRender = new RichTextRender().Clear();
            IFont boldFont = writer.GetFont(11, 0);
            IFont normalFont = writer.GetFont(12, 0);
            int lineCount = 0;

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ViewBy, boldFont, criteria.ViewBy, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Model, boldFont, criteria.Model == 1 ? "RT3" : "TA", normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.LeagueGroup, boldFont, GetLeagueGroupCodes(criteria.LeagueGroupIds), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Site, boldFont, GetSiteName(criteria.TypeSiteIds), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Measurement, boldFont, criteria.MeasurementDescs, normalFont, "\n");

            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(8, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }

        #endregion
    }
}
