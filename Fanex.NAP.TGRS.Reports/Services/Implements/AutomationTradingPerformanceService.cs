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
        private const string AutomationTradingLeaguePerformanceOfEventSessionKey = "Fanex.NAP.TGRS.Reports.AutomationTradingPerformance.LeagueOfEventList";
        private const string AutomationTradingModelPerformanceSessionKey = "Fanex.NAP.TGRS.Reports.AutomationTradingPerformance.ModelList";
        private const int PointInPixel = 225;
        #endregion

        #region Bet Type
        public Dictionary<int, LeagueGroup> GetLeagueGroups()
        {
            var leagueGroups = new Dictionary<int, LeagueGroup>();
            leagueGroups.Add(1, new LeagueGroup { Id = 1, Code = Consts.AutomationTradingLeagueGroupMJ, Name = Consts.AutomationTradingLeagueGroupMajor });
            leagueGroups.Add(2, new LeagueGroup { Id = 2, Code = Consts.AutomationTradingLeagueGroupM1, Name = Consts.AutomationTradingLeagueGroupMinor1 });
            leagueGroups.Add(3, new LeagueGroup { Id = 3, Code = Consts.AutomationTradingLeagueGroupM2, Name = Consts.AutomationTradingLeagueGroupMinor2 });
            leagueGroups.Add(4, new LeagueGroup { Id = 4, Code = Consts.AutomationTradingLeagueGroupM3, Name = Consts.AutomationTradingLeagueGroupMinor3 });
            leagueGroups.Add(5, new LeagueGroup { Id = 5, Code = Consts.AutomationTradingLeagueGroupM4, Name = Consts.AutomationTradingLeagueGroupMinor4 });
            leagueGroups.Add(6, new LeagueGroup { Id = 6, Code = Consts.AutomationTradingLeagueGroupOthers, Name = Consts.AutomationTradingLeagueGroupOthers });

            SessionManager.Set<Dictionary<int, LeagueGroup>>(AutomationTradingLeagueGroupsSessionKey, leagueGroups);

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
                    var summaryBetTypeData = multi.Read<SummaryBetTypeInfo>();
                    var totalBetTypeData = multi.Read<TotalPerformanceInfo>();
                    var betTypesData = multi.Read<BetTypePerformanceInfo>();

                    if (totalLeagueMatchData != null && totalLeagueMatchData.Any())
                    {
                        betTypeList.GenerateLeagueMacthTotal(totalLeagueMatchData.ToList()[0])
                                   .GenerateSummary(totalBetTypeData)
                                   .GenerateGroupHeader(criteria.Measurements, criteria.TypeSiteIds)
                                   .GenerateMeasurementHidden(criteria.MeasurementHides);

                        if (betTypesData != null && betTypesData.Any())
                        {
                            var betTypeIdsDisplay = new List<short> { 1, 3, 7, 8 };

                            var siteIdList = Array.ConvertAll(criteria.TypeSiteIds.Split(','), x => int.Parse(x)).ToList();

                            foreach (var betTypeId in betTypeIdsDisplay)
                            {
                                var summaryBetType = summaryBetTypeData.Where(x => x.BetType == betTypeId).FirstOrDefault();
                                var betTypeInfos = betTypesData.Where(x => x.BetType == betTypeId).OrderByDescending(x => x.TypeSiteId);
                                var betTypeName = CacheRef.GetBetType(betTypeId);

                                betTypeList.AddAutoTradingItem(siteIdList, betTypeInfos, summaryBetType, betTypeName, AutoTradingType.BetType);
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

                FillGroupHeader(betTypeData.GroupHeaderList, betTypeData.GrandTotal.RobotTradingItemList, columns, 4, ref writer);
                FillRowData(betTypeData.ItemList, 4, ref writer);
                FillGrandTotal(betTypeData.GrandTotal, 4, ref writer);

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
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.LeagueGroup, boldFont, GetLeagueGroupCodes(criteria.LeagueGroupIds), normalFont, "\n");
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
            int cellCopyIndex,
            ref ExcelTemplateWriter writer)
        {
            var rowGroupHeader = writer.CopyRows(3, 1);
            var rowHeader = FillHeader(robotTradingItemList, cellCopyIndex, ref writer);

            var cellMergeStartIndex = cellCopyIndex;
            var cellMergeEndIndex = cellCopyIndex;
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

            writer.SetRowValue(rowGroupHeader, columns.ToArray(), cellCopyIndex);

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

        private IRow FillHeader(IDictionary<string, RobotTradingItem> robotTradingItemList, 
            int cellCopyIndex,
            ref ExcelTemplateWriter writer)
        {
            var row = writer.CopyRows(4, 1);

            var columns = new List<object>();
            for (int i = 0; i < cellCopyIndex; i++)
            {
                columns.Add(string.Empty);
            }

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

            writer.SetRowValue(row, columns.ToArray(), cellCopyIndex);

            for (int i = 0; i < cellCopyIndex; i++)
            {
                SheetExtensions.MergeCells(row.Sheet, 2, i, 3, i);
            }            

            return row;
        }

        private void FillRowData(IList<AutoTradingItem> itemList, 
            int cellCopyIndex,
            ref ExcelTemplateWriter writer)
        {
            var index = 1;

            foreach (var item in itemList)
            {
                int styleIndex = index % 2 == 0 ? 6 : 5;
                var columns = cellCopyIndex == 4 
                    ? new List<object>
                    {
                        item.AutoTradingName,
                        item.LeagueCount,
                        item.MatchCount,
                        item.BetCount
                    }
                    : new List<object>()
                    {
                        item.AutoTradingName,
                        item.MatchCount,
                        item.BetCount
                    };

                FillRowData(item.RobotTradingItemList, columns, styleIndex, cellCopyIndex, ref writer);

                index++;
            }
        }

        private void FillGrandTotal(AutoTradingItem grandTotal,
            int cellCopyIndex,
            ref ExcelTemplateWriter writer)
        {
            var columns = cellCopyIndex == 4 
                ? new List<object>()
                {
                    ViewLang.GrandTotal,
                    grandTotal.LeagueCount,
                    grandTotal.MatchCount,
                    grandTotal.BetCount
                } 
                : new List<object>() {
                    ViewLang.GrandTotal,
                    grandTotal.MatchCount,
                    grandTotal.BetCount
                };
        
            FillRowData(grandTotal.RobotTradingItemList, columns, 7, cellCopyIndex, ref writer);
        }

        private IRow FillRowData(IDictionary<string, RobotTradingItem> robotTradingItemList,
           List<object> columns,
           int styleIndex,
           int cellCopyIndex,
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

            return writer.CreateRow(styleIndex, columns.ToArray(), cellCopyIndex);
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

                FilterBlockMonth(userId, criteria, ref writer);

                writer.FreezeRow(0, 4);

                var columns = new List<object>
                {
                    ViewLang.Period,
                    ViewLang.League,
                    ViewLang.Match,
                    ViewLang.BetCount
                };

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

        #region Event
        public AutoTradingList GetAutoTradingEventPerformance(GetEventPerformanceCriteria criteria)
        {
            var eventList = new AutoTradingList();
          
            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    var totalLeagueMatchData = multi.Read<TotalLeagueMatchInfo>();
                    var summaryEventData = multi.Read<SummaryEventInfo>();
                    var totalEventData = multi.Read<TotalPerformanceInfo>();
                    var eventData = multi.Read<EventPerformanceInfo>();

                    if (totalLeagueMatchData != null && totalLeagueMatchData.Any())
                    {
                        eventList.GenerateLeagueMacthTotal(totalLeagueMatchData.ToList()[0])
                                 .GenerateSummary(totalEventData)
                                 .GenerateGroupHeader(criteria.Measurements, criteria.TypeSiteIds)
                                 .GenerateMeasurementHidden(criteria.MeasurementHides);

                        if (eventData != null && eventData.Any())
                        {
                            var leagueGroupList = SessionManager.Get<Dictionary<int, LeagueGroup>>(AutomationTradingLeagueGroupsSessionKey);
                            var siteIdList = Array.ConvertAll(criteria.TypeSiteIds.Split(','), x => int.Parse(x)).ToList();

                            // Select league group MJ,M1,M2,M3,M4
                            var groupInfos = eventData
                                .Where(x=>x.LeagueGroupId < 6)
                                .OrderBy(x => x.LeagueGroupId)
                                .GroupBy(x => x.LeagueGroupId, (key, g) => new { LeagueGroupId = key, Items = g.ToList() });                            

                            foreach (var group in groupInfos)
                            {
                                var groupId = group.LeagueGroupId > 6 ? 6 : group.LeagueGroupId;
                                var leagueGroup = leagueGroupList.FirstOrDefault(x => x.Value.Id == groupId);
                                var summaryEventInfo = summaryEventData.FirstOrDefault(x => x.LeagueGroupId == group.LeagueGroupId);

                                eventList.AddAutoTradingItem(siteIdList, group.Items, summaryEventInfo, leagueGroup.Value.Name, AutoTradingType.LeagueGroup);
                            }

                            // Select league group Others
                            var groupOtherInfos = eventData.Where(x => x.LeagueGroupId >= 6);

                            if (groupOtherInfos.Any())
                            {
                                var summaryEventInfoOther = summaryEventData.Where(x => x.LeagueGroupId >= 6)
                                    .Aggregate<SummaryEventInfo, SummaryEventInfo>(null, (acc, s) => acc + s);

                                foreach (var siteId in siteIdList)
                                {
                                    var groupOtherBySiteInfo = groupOtherInfos.Where(x => x.TypeSiteId == siteId)
                                        .Aggregate<RTModelPerformanceInfo, RTModelPerformanceInfo>(null, (acc, s) => acc + s);

                                    if (groupOtherBySiteInfo != null)
                                    {
                                        eventList.AddAutoTradingItem(siteIdList, new List<RTModelPerformanceInfo> { groupOtherBySiteInfo }, summaryEventInfoOther, Consts.AutomationTradingLeagueGroupOthers, AutoTradingType.LeagueGroup);
                                    }                                    
                                }
                            }

                            eventList.GenerateGrandTotal();
                        }

                        SessionManager.Set<AutoTradingList>(AutomationTradingEventPerformanceSessionKey, eventList);
                    }
                }
            }

            return eventList;
        }        

        public void ExportAutoTradingEventPerformance(int userId, GetEventPerformanceCriteria criteria, string templatePath)
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

                FilterBlockEvent(userId, criteria, ref writer);

                writer.FreezeRow(0, 4);

                var columns = new List<object>
                {
                    ViewLang.Event,
                    ViewLang.League,
                    ViewLang.Match,
                    ViewLang.BetCount
                };

                FillGroupHeader(eventData.GroupHeaderList, eventData.GrandTotal.RobotTradingItemList, columns, 4, ref writer);
                FillRowData(eventData.ItemList, 4, ref writer);
                FillGrandTotal(eventData.GrandTotal, 4, ref writer);

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
        public void FilterBlockEvent(int userId, AutoTradingPerformanceCriteria criteria, ref ExcelTemplateWriter writer)
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

        public AutoTradingList GetAutoTradingLeaguePerformanceOfEvent(GetLeaguePerformanceOfEventCriteria criteria)
        {
            var leagueList = new AutoTradingList();

            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    var summaryLeagueOfEventData = multi.Read<SummaryLeagueOfEventInfo>();
                    var leagueData = multi.Read<LeaguePerformanceOfEventInfo>();

                    if (leagueData != null && leagueData.Any())
                    {
                        leagueList.GenerateGroupHeader(criteria.Measurements, criteria.TypeSiteIds)
                                  .GenerateMeasurementHidden(criteria.MeasurementHides);

                        var siteIdList = Array.ConvertAll(criteria.TypeSiteIds.Split(','), x => int.Parse(x)).ToList();

                        var groupInfos = leagueData
                               .OrderBy(x => x.LeagueId)
                               .GroupBy(x => x.LeagueId, (key, g) => new { LeagueId = key, Items = g.ToList() });

                        foreach (var group in groupInfos)
                        {                            
                            var summaryLeagueOfEventInfo = summaryLeagueOfEventData.FirstOrDefault(x => x.LeagueId == group.LeagueId);

                            leagueList.AddAutoTradingItem(siteIdList, group.Items, summaryLeagueOfEventInfo, summaryLeagueOfEventInfo.LeagueName, AutoTradingType.League);
                        }

                        leagueList.GenerateGrandTotal(true);
                    }

                    SessionManager.Set<AutoTradingList>(AutomationTradingLeaguePerformanceOfEventSessionKey, leagueList);
                }
            }

            return leagueList;
        }

        public void ExportAutoTradingLeaguePerformanceOfEvent(int userId, GetLeaguePerformanceOfEventCriteria criteria, string templatePath)
        {
            var leagueList = SessionManager.Get<AutoTradingList>(AutomationTradingLeaguePerformanceOfEventSessionKey);

            if (leagueList != null && leagueList.ItemList.Any())
            {
                string reportName = string.Format(
                                ViewLang.AutomationTradingPerformanceFileName,
                                ViewLang.League,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());

                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.League);
                var sheet = writer.CopyRows(0, 1).Sheet;

                FilterBlockEvent(userId, criteria, ref writer);

                writer.FreezeRow(0, 4);

                var columns = new List<object>
                {
                    ViewLang.League,                    
                    ViewLang.Match,
                    ViewLang.BetCount
                };

                FillGroupHeader(leagueList.GroupHeaderList, leagueList.GrandTotal.RobotTradingItemList, columns, 3, ref writer);
                FillRowData(leagueList.ItemList, 3, ref writer);
                FillGrandTotal(leagueList.GrandTotal, 3, ref writer);

                // Adjust column width for sheet
                sheet.SetColumnWidth(0, 8192);
                for (int i = 1; i < columns.Count; i++)
                {
                    sheet.SetColumnWidth(i, 4096);
                }

                writer.Render();
            }
        }

        public AutoTradingList GetAutoTradingEventLeaguePerformance(GetLeaguePerformanceOfEventCriteria criteria)
        {
            var eventLeagueList = new AutoTradingList();

            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    var summaryEventLeagueData = multi.Read<SummaryLeagueOfEventInfo>();
                    var eventLeagueData = multi.Read<LeaguePerformanceOfEventInfo>();

                    if (eventLeagueData != null && eventLeagueData.Any())
                    {
                        var siteIdList = Array.ConvertAll(criteria.TypeSiteIds.Split(','), x => int.Parse(x)).ToList();

                        eventLeagueList.GenerateGroupHeader(criteria.Measurements, criteria.TypeSiteIds)
                                       .GenerateMeasurementHidden(criteria.MeasurementHides);

                        // Get league group MJ,M1,M2,M3,M4
                        var groupInfos = summaryEventLeagueData
                               .Where(x => x.LeagueGroupId < 6)                               
                               .GroupBy(x => x.LeagueGroupId, (key, g) => new GroupingLeagueItem { LeagueGroupId = key, ItemList = g.ToList() });

                        GenerateLeagueGroup(groupInfos, eventLeagueData, summaryEventLeagueData, siteIdList, ref eventLeagueList);

                        // Get league group Others
                        var groupOtherInfos = summaryEventLeagueData
                              .Where(x => x.LeagueGroupId >= 6)
                              .GroupBy(x => x.LeagueGroupId, (key, g) => new GroupingLeagueItem { LeagueGroupId = key, ItemList = g.ToList() });

                        GenerateLeagueGroupOther(groupOtherInfos, eventLeagueData, summaryEventLeagueData, siteIdList, ref eventLeagueList);

                        eventLeagueList.GenerateGrandTotal(AutoTradingType.LeagueGroup, true);
                    }
                }
            }

            return eventLeagueList;
        }

        private void GenerateLeagueGroup(IEnumerable<GroupingLeagueItem> groupInfos,           
            IEnumerable<LeaguePerformanceOfEventInfo> eventLeagueData,
            IEnumerable<SummaryLeagueOfEventInfo> summaryEventLeagueData,
             List<int> siteIdList,
            ref AutoTradingList eventLeagueList
            )
        {
            var leagueGroupList = SessionManager.Get<Dictionary<int, LeagueGroup>>(AutomationTradingLeagueGroupsSessionKey);           

            foreach (var grouping in groupInfos)
            {
                var leagueGroup = leagueGroupList.FirstOrDefault(x => x.Value.Id == grouping.LeagueGroupId);
                var totalLeagueInfos = new List<RTModelPerformanceInfo>();

                foreach (var siteId in siteIdList)
                {
                    var totalLeagueInfo = eventLeagueData.Where(x => x.LeagueGroupId.Equals(grouping.LeagueGroupId)
                                                                && x.TypeSiteId.Equals(siteId))
                                                         .Aggregate<RTModelPerformanceInfo, RTModelPerformanceInfo>(null, (acc, s) => acc + s);
                    if (totalLeagueInfo != null)
                    {
                        totalLeagueInfos.Add(totalLeagueInfo);
                    }
                }

                if (totalLeagueInfos.Any())
                {
                    var summaryTotalLeagueInfo = summaryEventLeagueData.Where(x => x.LeagueGroupId == grouping.LeagueGroupId)
                                                                       .Aggregate<SummaryLeagueOfEventInfo, SummaryLeagueOfEventInfo>(null, (acc, s) => acc + s);

                    eventLeagueList.AddAutoTradingItem(siteIdList, totalLeagueInfos, summaryTotalLeagueInfo, leagueGroup.Value.Name, AutoTradingType.LeagueGroup);
                }

                foreach (var league in grouping.ItemList)
                {
                    var leagueInfos = eventLeagueData.Where(x => x.LeagueId == league.LeagueId);

                    eventLeagueList.AddAutoTradingItem(siteIdList, leagueInfos, league, league.LeagueName, AutoTradingType.League);
                }
            }
        }

        private void GenerateLeagueGroupOther(IEnumerable<GroupingLeagueItem> groupOtherInfos,
            IEnumerable<LeaguePerformanceOfEventInfo> eventLeagueData,
            IEnumerable<SummaryLeagueOfEventInfo> summaryEventLeagueData,
            List<int> siteIdList,
            ref AutoTradingList eventLeagueList)
        {
            var totalLeagueOtherInfo = eventLeagueData.Where(x => x.LeagueGroupId >= 6)
                                                                 .Aggregate<RTModelPerformanceInfo, RTModelPerformanceInfo>(null, (acc, s) => acc + s);
            if (totalLeagueOtherInfo != null)
            {
                var summaryTotalLeagueOtherInfo = summaryEventLeagueData.Where(x => x.LeagueGroupId >= 6)
                                                                        .Aggregate<SummaryLeagueOfEventInfo, SummaryLeagueOfEventInfo>(null, (acc, s) => acc + s);

                eventLeagueList.AddAutoTradingItem(siteIdList, new List<RTModelPerformanceInfo> { totalLeagueOtherInfo }, summaryTotalLeagueOtherInfo, Consts.AutomationTradingLeagueGroupOthers, AutoTradingType.LeagueGroup);
            }
            foreach (var grouping in groupOtherInfos)
            {
                foreach (var league in grouping.ItemList)
                {
                    var leagueInfos = eventLeagueData.Where(x => x.LeagueId == league.LeagueId);

                    eventLeagueList.AddAutoTradingItem(siteIdList, leagueInfos, league, league.LeagueName, AutoTradingType.League);
                }
            }
        }

        public void ExportAutoTradingEventLeaguePerformance(AutoTradingList eventLeagueList, 
            int userId, 
            GetLeaguePerformanceOfEventCriteria criteria, 
            string templatePath)
        {
            if (eventLeagueList != null && eventLeagueList.ItemList.Any())
            {
                string reportName = string.Format(
                                ViewLang.AutomationTradingPerformanceFileName,
                                ViewLang.League,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());

                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.AutomationTradingPerformance);
                var sheet = writer.CopyRows(0, 1).Sheet;

                FilterBlockEvent(userId, criteria, ref writer);

                writer.FreezeRow(0, 4);

                var columns = new List<object>
                {
                    ViewLang.Event,                  
                    ViewLang.Match,
                    ViewLang.BetCount
                };

                FillGroupHeader(eventLeagueList.GroupHeaderList, eventLeagueList.GrandTotal.RobotTradingItemList, columns, 3, ref writer);
                FillRowDataEventLeague(eventLeagueList.ItemList, 3, ref writer);
                FillGrandTotal(eventLeagueList.GrandTotal, 3, ref writer);

                // Adjust column width for sheet
                sheet.SetColumnWidth(0, 9216);
                for (int i = 1; i < columns.Count; i++)
                {
                    sheet.SetColumnWidth(i, 4096);
                }

                writer.Render();
            }
        }

        private void FillRowDataEventLeague(IList<AutoTradingItem> itemList,
           int cellCopyIndex,
           ref ExcelTemplateWriter writer)
        {
            for (int i = 0; i < itemList.Count; i++)
            {
                var isNextItemExist = i + 1 < itemList.Count;
                var isLeagueGroup = itemList[i].Type == AutoTradingType.LeagueGroup;
                var styleIndex = isLeagueGroup ? 6 : 5;

                var columns = new List<object>()
                        {
                            itemList[i].AutoTradingName,
                            itemList[i].MatchCount,
                            itemList[i].BetCount
                        };

                var row = FillRowData(itemList[i].RobotTradingItemList, columns, styleIndex, cellCopyIndex, ref writer);

                if (isLeagueGroup)
                {
                    row.GetCell(0).CellStyle.Alignment = HorizontalAlignment.Center;
                }               

                if (isNextItemExist)
                {
                    var isNextLeagueGroup = itemList[i + 1].Type == AutoTradingType.LeagueGroup;
                    if (isNextLeagueGroup)
                    {
                        writer.CreateRow(5, new object[columns.Count], cellCopyIndex);
                    }
                }
            }
        }

        public AutoTradingList GetAutoTradingMatchPerformanceOfEventLeague(GetMatchPerformanceOfEventLeagueCriteria criteria)
        {
            return new AutoTradingList();
        }

        public void ExportAutoTradingMatchPerformanceOfEventLeague(int userId, GetMatchPerformanceOfEventLeagueCriteria criteria, string templatePath)
        {

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

        private string GetLeagueGroupCodes(string leagueGroupIds)
        {
            var leagueGroups = SessionManager.Get<Dictionary<int, LeagueGroup>>(AutomationTradingLeagueGroupsSessionKey);
            var leagueGroupIdList = Array.ConvertAll(leagueGroupIds.Split(','), s => Int16.Parse(s)).ToList();

            if (leagueGroups.Count == leagueGroupIdList.Count)
            {
                return ViewLang.All;
            }

            var leagueGroupCodes = leagueGroups.Join(leagueGroupIdList, a => a.Key, b => b, (a, b) => a.Value.Code);

            return string.Join(",", leagueGroupCodes);
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
                        siteNames.Add(Consts.AutomationTradingSiteCN88);
                        break;
                    case 2:
                        siteNames.Add(Consts.AutomationTradingSiteCash);
                        break;
                    case 3:
                        siteNames.Add(Consts.AutomationTradingSiteNova);
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