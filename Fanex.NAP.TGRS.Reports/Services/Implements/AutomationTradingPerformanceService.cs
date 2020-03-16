namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.Data;
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Consts;
    using Fanex.NAP.TGRS.Core.ExcelUtility;
    using Fanex.NAP.TGRS.Core.ExcelUtility.NPOIExtensions;
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

    public class AutomationTradingPerformanceService : TGRSBaseService, IAutomationTradingPerformanceService
    {
        #region Consts
        private const string AutomationTradingLeagueGroupsSessionKey = "Fanex.NAP.TGRS.Reports.AutomationTradingPerformance.LeagueGroups";
        private const string AutomationTradingBetTypeListSessionKey = "Fanex.NAP.TGRS.Reports.AutomationTradingPerformance.BetTypeList";
        private const string AutomationTradingPeriodPerformanceSessionKey = "Fanex.NAP.TGRS.Reports.AutomationTradingPerformance.PeriodList";
        private const string AutomationTradingEventPerformanceSessionKey = "Fanex.NAP.TGRS.Reports.AutomationTradingPerformance.EventList";
        private const string AutomationTradingModelPerformanceSessionKey = "Fanex.NAP.TGRS.Reports.AutomationTradingPerformance.ModelList";
        private const int PointInPixel = 225;
        #endregion

        #region Bet Type
        public Dictionary<int, string> GetLeagueGroups()
        {
            var leagueGroups = new Dictionary<int, string>();
            leagueGroups.Add(1, Consts.AutomationTradingLeagueGroupMJ);
            leagueGroups.Add(2, Consts.AutomationTradingLeagueGroupM1);
            leagueGroups.Add(3, Consts.AutomationTradingLeagueGroupM2);
            leagueGroups.Add(4, Consts.AutomationTradingLeagueGroupM3);
            leagueGroups.Add(5, Consts.AutomationTradingLeagueGroupM4);
            leagueGroups.Add(6, Consts.AutomationTradingLeagueGroupOthers);
            SessionManager.Set<Dictionary<int, string>>(AutomationTradingLeagueGroupsSessionKey, leagueGroups);

            return leagueGroups;
        }

        public AutoTradingList GetAutoTradingBetTypePerformance(GetBetTypePerformanceCriteria criteria)
        {
            var betTypeList = new AutoTradingList();
            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    var totalLeagueMatchData = multi.Read<TotalLeagueMatchInfo>();
                    var leagueMatchCountData = multi.Read<SummaryLeagueMatchBetCountInfo>();
                    var totalPerformanceData = multi.Read<TotalPerformanceInfo>();
                    var betTypesData = multi.Read<BetTypePerformanceInfo>();

                    if (totalLeagueMatchData != null && totalLeagueMatchData.Any())
                    {
                        betTypeList.GenerateLeagueMacthTotal(totalLeagueMatchData.ToList()[0])
                                   .GenerateSummary(totalPerformanceData)
                                   .GenerateGroupHeader(criteria.Measurements, criteria.TypeSiteIds)
                                   .GenerateMeasurementHidden(criteria.MeasurementHides);

                        if (betTypesData != null && betTypesData.Any())
                        {
                            var betTypeIdsDisplay = new List<short> { 1, 3, 7, 8 };

                            var siteIdList = Array.ConvertAll(criteria.TypeSiteIds.Split(','), x => int.Parse(x)).ToList();

                            foreach (var betTypeId in betTypeIdsDisplay)
                            {
                                var leagueMatchCountInfo = leagueMatchCountData.Where(x => x.BetType == betTypeId).FirstOrDefault();
                                var betTypeInfos = betTypesData.Where(x => x.BetType == betTypeId).OrderByDescending(x => x.TypeSiteId);
                                var betTypeName = CacheRef.GetBetType(betTypeId);

                                betTypeList.AddAutoTradingItem(siteIdList, betTypeInfos, leagueMatchCountInfo, betTypeName);
                            }
                        }

                        betTypeList.GenerateGrandTotal();

                        SessionManager.Set<AutoTradingList>(AutomationTradingBetTypeListSessionKey, betTypeList);
                    }
                }
            }

            return betTypeList;
        }

        public void ExportAutoTradingBetTypePerformance(int userId, GetBetTypePerformanceCriteria criteria, string templatePath)
        {
            var betTypeData = SessionManager.Get<AutoTradingList>(AutomationTradingBetTypeListSessionKey);

            if (betTypeData != null && betTypeData.ItemList.Any())
            {
                string reportName = string.Format(
                                ViewLang.AutomationTradingPerformanceFileName,
                                ViewLang.BetTypeExcelFile,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());

                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.BetType);

                var sheet = writer.CopyRows(0, 1).Sheet;
                FilterBlockBetType(userId, criteria, ref writer);

                writer.FreezeRow(0, 4);
                var columns = new List<object>
                {
                    ViewLang.BetType,
                    ViewLang.League,
                    ViewLang.Match,
                    ViewLang.BetCount
                };

                FillGroupHeader(betTypeData.GroupHeaderList, betTypeData.GrandTotal.RobotTradingItemList, columns, ref writer);
                FillRowData(betTypeData.ItemList, ref writer);
                FillGrandTotal(betTypeData.GrandTotal, ref writer);

                // Adjust column width for sheet
                for (int i = 0; i < columns.Count; i++)
                {
                    sheet.SetColumnWidth(i, 4096);
                }

                writer.Render();
            }
        }

        [SuppressMessage("StyleCop.CSharp.StylecopPlus.Rules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Need to review here.")]
        private void FilterBlockBetType(int userId, GetBetTypePerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            RichTextRender contentRender = new RichTextRender().Clear();
            IFont boldFont = writer.GetFont(11, 0);
            IFont normalFont = writer.GetFont(12, 0);
            int lineCount = 0;

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Model, boldFont, criteria.Model == 1 ? "RT3" : "TA", normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.LeagueGroup, boldFont, GetLeagueGroupNames(criteria.LeagueGroupIds), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Site, boldFont, GetSiteName(criteria.TypeSiteIds), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Measurement, boldFont, criteria.MeasurementDescs, normalFont, "\n");

            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(8, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }       

        private void FillGroupHeader(IList<GroupHeader> groupHeaderList,
            IDictionary<string, RobotTradingItem> robotTradingItemList,
            List<object> columns,
            ref ExcelTemplateWriter writer)
        {
            var rowGroupHeader = writer.CopyRows(3, 1);
            var rowHeader = FillHeader(robotTradingItemList, ref writer);

            var cellMergeStartIndex = 4;
            var cellMergeEndIndex = 4;
            var cellStyle = writer.GetCellStyle(13, 0);

            // Fill Group Header
            foreach (var groupHeader in groupHeaderList)
            {
                columns.Add(groupHeader.HeaderText);

                for (int i = 0; i < groupHeader.MergeColumnNumber - 1; i++)
                {
                    columns.Add(string.Empty);
                }
            }

            writer.SetRowValue(rowGroupHeader, columns.ToArray(), 4);

            // Merge range Group Header
            for (int i = 0; i < groupHeaderList.Count; i++)
            {
                cellMergeEndIndex = cellMergeStartIndex + groupHeaderList[i].MergeColumnNumber - 1;
                SheetExtensions.MergeCells(rowGroupHeader.Sheet, 2, cellMergeStartIndex, 2, cellMergeEndIndex);

                if (i % 2 != 0)
                {
                    writer.SetCellStyle(rowGroupHeader, cellStyle, cellMergeStartIndex, cellMergeEndIndex);
                    writer.SetCellStyle(rowHeader, cellStyle, cellMergeStartIndex, cellMergeEndIndex + 1);
                }

                cellMergeStartIndex = cellMergeEndIndex + 1;
            }
        }

        private IRow FillHeader(IDictionary<string, RobotTradingItem> robotTradingItemList, ref ExcelTemplateWriter writer)
        {
            var row = writer.CopyRows(4, 1);

            var columns = new List<object> { string.Empty, string.Empty, string.Empty, string.Empty };

            foreach (var robotTradingItem in robotTradingItemList)
            {
                if (!robotTradingItem.Value.IsHideTurnover)
                {
                    columns.Add(robotTradingItem.Value.TypeSiteDesc + " T/O");
                }
                if (!robotTradingItem.Value.IsHideWinLoss)
                {
                    columns.Add(robotTradingItem.Value.TypeSiteDesc + " W/L");
                }
                if (!robotTradingItem.Value.IsHideMargin)
                {
                    columns.Add(robotTradingItem.Value.TypeSiteDesc + " MAR %");
                }
            }

            writer.SetRowValue(row, columns.ToArray(), 4);

            SheetExtensions.MergeCells(row.Sheet, 2, 0, 3, 0);
            SheetExtensions.MergeCells(row.Sheet, 2, 1, 3, 1);
            SheetExtensions.MergeCells(row.Sheet, 2, 2, 3, 2);
            SheetExtensions.MergeCells(row.Sheet, 2, 3, 3, 3);

            return row;
        }

        private void FillRowData(IList<AutoTradingItem> itemList, ref ExcelTemplateWriter writer)
        {
            var index = 1;

            foreach (var betTypeItem in itemList)
            {
                int styleIndex = index % 2 == 0 ? 6 : 5;
                var columns = new List<object>
                {
                    betTypeItem.AutoTradingName,
                    betTypeItem.LeagueCount,
                    betTypeItem.MatchCount,
                    betTypeItem.BetCount
                };

                FillRowData(betTypeItem.RobotTradingItemList, columns, styleIndex, ref writer);

                index++;
            }
        }

        private void FillGrandTotal(AutoTradingItem grandTotal, ref ExcelTemplateWriter writer)
        {
            var columns = new List<object>
            {
                ViewLang.GrandTotal,
                grandTotal.LeagueCount,
                grandTotal.MatchCount,
                grandTotal.BetCount
            };

            FillRowData(grandTotal.RobotTradingItemList, columns, 7, ref writer);
        }

        private IRow FillRowData(IDictionary<string, RobotTradingItem> robotTradingItemList,
           List<object> columns,
           int styleIndex,
           ref ExcelTemplateWriter writer)
        {           
            foreach (var robotTradingItem in robotTradingItemList)
            {
                if (!robotTradingItem.Value.IsHideTurnover)
                {
                    columns.Add(robotTradingItem.Value.Turnover);                 
                }
                if (!robotTradingItem.Value.IsHideWinLoss)
                {
                    columns.Add(robotTradingItem.Value.WinLoss);                   
                }
                if (!robotTradingItem.Value.IsHideMargin)
                {
                    columns.Add(robotTradingItem.Value.Margin);                  
                }
            }

            return writer.CreateRow(styleIndex, columns.ToArray(), 4);
        }

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
                    var leagueMatchCountData = multi.Read<SummaryLeagueMatchBetCountInfo>();
                    var totalPerformanceData = multi.Read<TotalPerformanceInfo>();
                    var weekData = multi.Read<WeekPerformanceInfo>();

                    if (totalLeagueMatchData != null && totalLeagueMatchData.Any())
                    {
                        weekList.GenerateLeagueMacthTotal(totalLeagueMatchData.ToList()[0])
                                .GenerateSummary(totalPerformanceData)
                                .GenerateGroupHeader(criteria.Measurements, criteria.TypeSiteIds)
                                .GenerateMeasurementHidden(criteria.MeasurementHides);

                        if (weekData != null && weekData.Any())
                        {
                            var groupInfos = weekData
                                .OrderBy(x => x.StartDate)
                                .GroupBy(x => x.WeekDays, (key, g) => new { WeekDays = key, Items = g.ToList() });

                            foreach (var group in groupInfos)
                            {
                                var siteIdList = Array.ConvertAll(criteria.TypeSiteIds.Split(','), x => int.Parse(x)).ToList();

                                var leagueMatchCountInfo = leagueMatchCountData.Where(x => x.WeekDays == group.WeekDays).FirstOrDefault();

                                weekList.AddAutoTradingItem(siteIdList, group.Items, leagueMatchCountInfo, GeneratePeriod(group.Items[0]));
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
                    var leagueMatchCountData = multi.Read<SummaryLeagueMatchBetCountInfo>();
                    var totalPerformanceData = multi.Read<TotalPerformanceInfo>();
                    var monthlyData = multi.Read<MonthPerformanceInfo>();

                    if (totalLeagueMatchData != null && totalLeagueMatchData.Any())
                    {
                        monthlyList.GenerateLeagueMacthTotal(totalLeagueMatchData.ToList()[0])
                                   .GenerateSummary(totalPerformanceData)
                                   .GenerateGroupHeader(criteria.Measurements, criteria.TypeSiteIds)
                                   .GenerateMeasurementHidden(criteria.MeasurementHides);

                        if (monthlyData != null && monthlyData.Any())
                        {
                            var groupInfos = monthlyData
                                .OrderBy(x => x.RptMonth)
                                .GroupBy(x => x.RptMonth, (key, g) => new { RptMonth = key, Items = g.ToList() });

                            foreach (var group in groupInfos)
                            {
                                var siteIdList = Array.ConvertAll(criteria.TypeSiteIds.Split(','), x => int.Parse(x)).ToList();

                                var matchCountInfo = leagueMatchCountData.Where(x => x.RptMonth == group.RptMonth).FirstOrDefault();

                                monthlyList.AddAutoTradingItem(siteIdList, group.Items, matchCountInfo, group.RptMonth.ToString(Consts.FormatDateTimeToString_yyyyMMdd));
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

                FilterBlockMonth(userId, criteria, ref writer);

                writer.FreezeRow(0, 4);

                var columns = new List<object>
                {
                    ViewLang.Period,
                    ViewLang.League,
                    ViewLang.Match,
                    ViewLang.BetCount
                };

                FillGroupHeader(periodData.GroupHeaderList, periodData.GrandTotal.RobotTradingItemList, columns, ref writer);
                FillRowData(periodData.ItemList, ref writer);
                FillGrandTotal(periodData.GrandTotal, ref writer);

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
        private void FilterBlockMonth(int userId, GetMonthPerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            RichTextRender contentRender = new RichTextRender().Clear();
            IFont boldFont = writer.GetFont(11, 0);
            IFont normalFont = writer.GetFont(12, 0);
            int lineCount = 0;

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ViewBy, boldFont, criteria.ViewBy, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Model, boldFont, criteria.Model == 1 ? "RT3" : "TA", normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.LeagueGroup, boldFont, GetLeagueGroupNames(criteria.LeagueGroupIds), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Site, boldFont, GetSiteName(criteria.TypeSiteIds), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Measurement, boldFont, criteria.MeasurementDescs, normalFont, "\n");

            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(8, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }        
       
        #endregion

        #region Event
        public AutoTradingList GetAutoTradingEventPerformance(GetEventPerformanceCriteria criteria)
        {
            var eventList = new AutoTradingList();
          
            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    var totalLeagueMatchData = multi.Read<TotalLeagueMatchInfo>();
                    var leagueMatchCountData = multi.Read<SummaryLeagueMatchBetCountInfo>();
                    var totalPerformanceData = multi.Read<TotalPerformanceInfo>();
                    var eventData = multi.Read<EventPerformanceInfo>();

                    if (totalLeagueMatchData != null && totalLeagueMatchData.Any())
                    {
                        eventList.GenerateLeagueMacthTotal(totalLeagueMatchData.ToList()[0])
                                 .GenerateSummary(totalPerformanceData)
                                 .GenerateGroupHeader(criteria.Measurements, criteria.TypeSiteIds)
                                 .GenerateMeasurementHidden(criteria.MeasurementHides);

                        if (eventData != null && eventData.Any())
                        {
                            var groupInfos = eventData
                                .OrderBy(x => x.LeagueGroupId)
                                .GroupBy(x => x.LeagueGroupId, (key, g) => new { LeagueGroupId = key, Items = g.ToList() });

                            foreach (var group in groupInfos)
                            {
                                var siteIdList = Array.ConvertAll(criteria.TypeSiteIds.Split(','), x => int.Parse(x)).ToList();

                                var leagueMatchCountInfo = leagueMatchCountData.Where(x => x.LeagueGroupId == group.LeagueGroupId).FirstOrDefault();

                                eventList.AddAutoTradingItem(siteIdList, group.Items, leagueMatchCountInfo, group.LeagueGroupId.ToString());
                            }

                            eventList.GenerateGrandTotal();
                        }

                        SessionManager.Set<AutoTradingList>(AutomationTradingEventPerformanceSessionKey, eventList);
                    }
                }
            }

            return eventList;
        }        

        public void ExportAutoTradingEventLeagueGroupPerformance(int userId, GetEventPerformanceCriteria criteria, string templatePath)
        {
            var eventData = SessionManager.Get<AutoTradingList>(AutomationTradingEventPerformanceSessionKey);

            if (eventData != null && eventData.ItemList.Any())
            {
                string reportName = string.Format(
                                ViewLang.AutomationTradingPerformanceFileName,
                                ViewLang.Event,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());

                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.Event);
                var sheet = writer.CopyRows(0, 1).Sheet;

                FilterBlockEventLeagueGroup(userId, criteria, ref writer);

                writer.FreezeRow(0, 4);

                var columns = new List<object>
                {
                    ViewLang.Event,
                    ViewLang.League,
                    ViewLang.Match,
                    ViewLang.BetCount
                };

                FillGroupHeader(eventData.GroupHeaderList, eventData.GrandTotal.RobotTradingItemList, columns, ref writer);
                FillRowData(eventData.ItemList, ref writer);
                FillGrandTotal(eventData.GrandTotal, ref writer);

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
        public void FilterBlockEventLeagueGroup(int userId, GetEventPerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            RichTextRender contentRender = new RichTextRender().Clear();
            IFont boldFont = writer.GetFont(11, 0);
            IFont normalFont = writer.GetFont(12, 0);
            int lineCount = 0;
            
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Model, boldFont, criteria.Model == 1 ? "RT3" : "TA", normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Site, boldFont, GetSiteName(criteria.TypeSiteIds), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Measurement, boldFont, criteria.MeasurementDescs, normalFont, "\n");

            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(8, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }
       
        #endregion

        #region Model
        public ModelPerformanceList GetAutoTradingModelPerformance(GetModelPerformanceCriteria criteria)
        {
            var modelPerformanceList = new ModelPerformanceList();
            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    var totalLeagueMatchData = multi.Read<TotalLeagueMatchInfo>();
                    var totalPerformanceData = multi.Read<TotalPerformanceInfo>();
                    var modelData = multi.Read<ModelPerformanceInfo>();

                    if (totalLeagueMatchData != null && totalLeagueMatchData.Any())
                    {
                        modelPerformanceList.AddLeagueMacthTotal(totalLeagueMatchData.ToList()[0]);

                        if (modelPerformanceList.MatchCount > 0)
                        {
                            if (totalPerformanceData != null && totalPerformanceData.Any())
                            {
                                modelPerformanceList.AddGrandTotal(totalPerformanceData.ToList()[0]);
                            }

                            if (modelData != null && modelData.Any())
                            {
                                modelPerformanceList.AddModelList(modelData, criteria.DataType);
                            }

                            SessionManager.Set<ModelPerformanceList>(AutomationTradingModelPerformanceSessionKey, modelPerformanceList);
                        }
                    }
                }
            }

            return modelPerformanceList;
        }

        public void ExportAutoTradingModelPerformance(int userId, GetModelPerformanceCriteria criteria, string templatePath)
        {
            var modelData = SessionManager.Get<ModelPerformanceList>(AutomationTradingModelPerformanceSessionKey);

            if (modelData != null && modelData.ItemList.Any())
            {
                string reportName = string.Format(
                        ViewLang.AutomationTradingPerformanceFileName,
                        ViewLang.Model,
                        criteria.FromDate.ToShortFormatedDateForFileName(),
                        criteria.ToDate.ToShortFormatedDateForFileName());

                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.Model);

                writer.CopyRows(0, 1);

                FilterBlockModel(userId, criteria, ref writer);
                FillHeader(ref writer, criteria.DataType == ViewLang.Percentage);

                writer.FreezeRow(0, 4);

                FillRowDataModel(modelData, ref writer, criteria.DataType);

                writer.SyncColumnsWidth(17);
                writer.Render();
            }
        }

        [SuppressMessage("StyleCop.CSharp.StylecopPlus.Rules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Need to review here.")]
        private void FilterBlockModel(int userId, GetModelPerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            RichTextRender contentRender = new RichTextRender().Clear();
            IFont boldFont = writer.GetFont(11, 0);
            IFont normalFont = writer.GetFont(12, 0);
            int lineCount = 0;

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.DataType, boldFont, criteria.DataType, normalFont, "\n");

            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(8, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }

        private void FillHeader(ref ExcelTemplateWriter writer, bool isPercentage)
        {
            if (isPercentage)
            {
                var rowGroupHeader = writer.CopyRows(3, 1);
                rowGroupHeader.GetCell(1).SetCellValue(ViewLang.Match + " %");
                rowGroupHeader.GetCell(2).SetCellValue(ViewLang.BetCount + " %");

                var rowHeader = writer.CopyRows(4, 1);
                rowHeader.GetCell(3).SetCellValue(ViewLang.Turnover + " %");
                rowHeader.GetCell(4).SetCellValue(ViewLang.WinLoss + " %");
                rowHeader.GetCell(5).SetCellValue(ViewLang.Margin);
                rowHeader.GetCell(6).SetCellValue(ViewLang.Turnover + " %");
                rowHeader.GetCell(7).SetCellValue(ViewLang.WinLoss + " %");
                rowHeader.GetCell(8).SetCellValue(ViewLang.Margin);
                rowHeader.GetCell(9).SetCellValue(ViewLang.Turnover + " %");
                rowHeader.GetCell(10).SetCellValue(ViewLang.WinLoss + " %");
                rowHeader.GetCell(11).SetCellValue(ViewLang.Margin);
                rowHeader.GetCell(12).SetCellValue(ViewLang.Turnover + " %");
                rowHeader.GetCell(13).SetCellValue(ViewLang.WinLoss + " %");
                rowHeader.GetCell(14).SetCellValue(ViewLang.Margin);
                rowHeader.GetCell(15).SetCellValue(ViewLang.Turnover + " %");
                rowHeader.GetCell(16).SetCellValue(ViewLang.WinLoss + " %");
                rowHeader.GetCell(17).SetCellValue(ViewLang.Margin);
            }
            else
            {
                writer.CopyRows(3, 2);
            }
        }

        private void FillRowDataModel(ModelPerformanceList data, ref ExcelTemplateWriter writer, string dataType)
        {
            var index = 1;
            foreach (var item in data.ItemList)
            {
                int styleIndex = index % 2 == 0 ? 6 : 5;
                var record = new object[]
                {
                    item.ModelName,
                    item.MatchCount,
                    item.BetCount,
                    item.VirtualTotalTurnover,
                    item.VirtualTotalWinLoss,
                    (object)item.VirtualTotalMargin ?? ViewLang.NA,
                    item.VarianceTurnover,
                    item.VarianceWinLoss,
                    (object)item.VarianceMargin ?? ViewLang.NA,
                    item.RealTotalTurnover,
                    item.RealTotalWinLoss,
                    (object)item.RealTotalMargin ?? ViewLang.NA,
                    item.Total8RMTurnover,
                    item.Total8RMWinLoss,
                    (object)item.Total8RMMargin ?? ViewLang.NA,
                    item.Total8RMWLTurnover,
                    item.Total8RMWLWinLoss,
                    (object)item.Total8RMWLMargin ?? ViewLang.NA
                };

                writer.WriteRow(styleIndex, record);
                index++;
            }

            var total = data.GrandTotal;
            if (dataType == ViewLang.Number)
            {
                var totalRecord = new object[]
                {
                    ViewLang.GrandTotal,
                    total.MatchCount,
                    total.BetCount,
                    total.VirtualTotalTurnover,
                    total.VirtualTotalWinLoss,
                    (object)total.VirtualTotalMargin ?? ViewLang.NA,
                    total.VarianceTurnover,
                    total.VarianceWinLoss,
                    (object)total.VarianceMargin ?? ViewLang.NA,
                    total.RealTotalTurnover,
                    total.RealTotalWinLoss,
                    (object)total.RealTotalMargin ?? ViewLang.NA,
                    total.Total8RMTurnover,
                    total.Total8RMWinLoss,
                    (object)total.Total8RMMargin ?? ViewLang.NA,
                    total.Total8RMWLTurnover,
                    total.Total8RMWLWinLoss,
                    (object)total.Total8RMWLMargin ?? ViewLang.NA
                };
                writer.WriteRow(7, totalRecord);
            }
            else
            {
                var totalRecord = new object[]
                {
                    ViewLang.GrandTotal,
                    null,
                    null,
                    null,
                    null,
                    (object)total.VirtualTotalMargin ?? ViewLang.NA,
                    null,
                    null,
                    (object)total.VarianceMargin ?? ViewLang.NA,
                    null,
                    null,
                    (object)total.RealTotalMargin ?? ViewLang.NA,
                    null,
                    null,
                    (object)total.Total8RMMargin ?? ViewLang.NA,
                    null,
                    null,
                    (object)total.Total8RMWLMargin ?? ViewLang.NA
                };
                writer.WriteRow(7, totalRecord);
            }
        }

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
            int charPerLine = 216; // Number char per line in filter block - use to calculate number of line
            var line = name + value;
            lineCount += Convert.ToInt32(Math.Ceiling((float)line.Length / charPerLine));
        }

        private string GetLeagueGroupNames(string leagueGroupIds)
        {
            var leagueGroups = SessionManager.Get<Dictionary<int, string>>(AutomationTradingLeagueGroupsSessionKey);
            var leagueGroupIdList = Array.ConvertAll(leagueGroupIds.Split(','), s => Int16.Parse(s)).ToList();

            if (leagueGroups.Count == leagueGroupIdList.Count)
            {
                return ViewLang.All;
            }

            var leagueGroupNames = leagueGroups.Join(leagueGroupIdList, a => a.Key, b => b, (a, b) => a.Value);

            return string.Join(",", leagueGroupNames);
        }

        private string GetSiteName(string siteIds)
        {
            var siteIdList = Array.ConvertAll(siteIds.Split(','), s => Int16.Parse(s)).ToList();
            var siteNames = new List<string>();

            foreach (var siteId in siteIdList)
            {
                switch (siteId)
                {
                    case 1:
                        siteNames.Add(Consts.SiteCN88);
                        break;
                    case 2:
                        siteNames.Add(Consts.SiteCash);
                        break;
                    case 3:
                        siteNames.Add(Consts.SiteNova);
                        break;
                }
            }

            if (siteNames.Count == 3)
            {
                return ViewLang.All;
            }

            return string.Join(",", siteNames);
        }

        #endregion

    }
}