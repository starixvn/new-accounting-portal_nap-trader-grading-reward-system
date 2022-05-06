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

    public partial class AutomationTradingReportService : TGRSBaseService, IAutomationTradingReportService
    {
        #region Event
        public AutoTradingList GetAutoTradingEventPerformance(GetEventPerformanceCriteria criteria)
        {
            var eventList = new AutoTradingList();

            using (var objectDb = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria))
                {
                    var totalLeagueMatchData = multi.Read<TotalLeagueMatchInfo>();
                    var summaryEventData = multi.Read<SummaryEventInfo>();
                    var totalEventData = multi.Read<TotalPerformanceInfo>();
                    var eventData = multi.Read<EventPerformanceInfo>();

                    if (totalLeagueMatchData != null && totalLeagueMatchData.Any())
                    {
                        eventList.GenerateLeagueMatchTotal(totalLeagueMatchData.ToList()[0])
                                 .GenerateSummary(totalEventData)
                                 .GenerateGroupHeader(criteria.Measurements, criteria.TypeSiteIds)
                                 .GenerateMeasurementHidden(criteria.MeasurementHides);

                        if (eventData != null && eventData.Any())
                        {
                            var leagueGroupList = SessionManager.Get<Dictionary<int, LeagueGroup>>(Consts.AutomationTradingLeagueGroupsSessionKey);
                            var siteIdList = Array.ConvertAll(criteria.TypeSiteIds.Split(','), x => int.Parse(x)).ToList();
                            
                            var groupInfos = eventData                             
                                .OrderBy(x => x.LeagueGroupId)
                                .GroupBy(x => x.LeagueGroupId, (key, g) => new { LeagueGroupId = key, Items = g.ToList() });

                            foreach (var grouping in groupInfos)
                            {                               
                                var leagueGroup = leagueGroupList.FirstOrDefault(x => x.Value.Id == grouping.LeagueGroupId);
                                var summaryEventInfo = summaryEventData.FirstOrDefault(x => x.LeagueGroupId == grouping.LeagueGroupId);

                                eventList.AddAutoTradingItem(siteIdList, grouping.Items, summaryEventInfo, leagueGroup.Value.Name, AutoTradingType.LeagueGroup);
                            }                           

                            eventList.GenerateGrandTotal();
                        }

                        SessionManager.Set<AutoTradingList>(Consts.AutomationTradingEventPerformanceSessionKey, eventList);
                    }
                }
            }

            return eventList;
        }

        public void ExportAutoTradingEventPerformance(int userId, GetEventPerformanceCriteria criteria, string templatePath)
        {
            var eventList = SessionManager.Get<AutoTradingList>(Consts.AutomationTradingEventPerformanceSessionKey);

            if (eventList != null && eventList.ItemList.Any())
            {
                string reportName = string.Format(
                                ViewLang.AutomationTradingPerformanceFileName,
                                ViewLang.Event,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());

                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.Event);
                var sheet = writer.CopyRows(0, 1).Sheet;

                var columns = new List<object>
                {
                    ViewLang.Event,
                    ViewLang.League,
                    ViewLang.Match,
                    ViewLang.BetCount
                };

                FillDataReport(eventList, criteria, userId, columns, string.Empty, ref writer);

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
        public void FilterBlock(int userId, AutoTradingPerformanceCriteria criteria, string breadcrumb, ref ExcelTemplateWriter writer)
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

            if (!string.IsNullOrEmpty(breadcrumb))
            {
                var arrDrilldownTab = breadcrumb.Split(';');
                if (arrDrilldownTab.Length > 0)
                {
                    for (int i = 0; i < arrDrilldownTab.Length; i++)
                    {
                        var arrDrilldownLeague = arrDrilldownTab[i].Split(':');
                        if (arrDrilldownLeague.Length == 2)
                        {
                            AppendBlockContent(ref contentRender, ref lineCount, arrDrilldownLeague[0], boldFont, arrDrilldownLeague[1], normalFont, "\n");
                        }
                    }
                }
            }

            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(8, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }

        public AutoTradingList GetAutoTradingLeaguePerformanceOfEvent(GetLeaguePerformanceOfEventCriteria criteria)
        {
            var leagueList = GetAutoTradingLeaguePerformance(criteria);

            SessionManager.Set<AutoTradingList>(Consts.AutomationTradingLeaguePerformanceOfEventSessionKey, leagueList);

            return leagueList;
        }

        private AutoTradingList GetAutoTradingLeaguePerformance(AutoTradingPerformanceCriteria criteria)
        {
            var leagueList = new AutoTradingList();

            using (var objectDb = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria))
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
                }
            }

            return leagueList;
        }

        public string GetLeagueIdListFromSession(string conditionKey, string sessionKey)
        {
            var autoTradingList = SessionManager.Get<AutoTradingList>(sessionKey);

            if (autoTradingList != null)
            {
                return autoTradingList.ItemList.FirstOrDefault(x => x.AutoTradingName.Equals(conditionKey)).LeagueIdList;
            }

            return string.Empty;
        }

        public void ExportAutoTradingLeaguePerformanceOfEvent(int userId, GetLeaguePerformanceOfEventCriteria criteria, string templatePath, string breadcrumb)
        {
            var leagueList = SessionManager.Get<AutoTradingList>(Consts.AutomationTradingLeaguePerformanceOfEventSessionKey);

            ExportAutoTradingLeaguePerformance(leagueList, userId, criteria, templatePath, breadcrumb);
        }

        private void ExportAutoTradingLeaguePerformance(AutoTradingList leagueList, int userId, AutoTradingPerformanceCriteria criteria, string templatePath, string breadcrumb)
        {
            if (leagueList != null && leagueList.ItemList.Any())
            {
                string reportName = string.Format(
                                ViewLang.AutomationTradingPerformanceFileName,
                                ViewLang.League,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());

                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.League);
                var sheet = writer.CopyRows(0, 1).Sheet;

                var columns = new List<object>
                {
                    ViewLang.League,
                    ViewLang.Match,
                    ViewLang.BetCount
                };

                FillDataReport(leagueList, criteria, userId, columns, breadcrumb, ref writer);

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

            using (var objectDb = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria))
                {
                    var summaryEventLeagueData = multi.Read<SummaryLeagueOfEventInfo>();
                    var eventLeagueData = multi.Read<LeaguePerformanceOfEventInfo>();

                    if (eventLeagueData != null && eventLeagueData.Any())
                    {
                        var siteIdList = Array.ConvertAll(criteria.TypeSiteIds.Split(','), x => int.Parse(x)).ToList();

                        eventLeagueList.GenerateGroupHeader(criteria.Measurements, criteria.TypeSiteIds)
                                       .GenerateMeasurementHidden(criteria.MeasurementHides);
                      
                        var groupInfos = summaryEventLeagueData                           
                               .GroupBy(x => x.LeagueGroupId, (key, g) => new GroupingLeagueItem { LeagueGroupId = key, ItemList = g.ToList() });

                        GenerateLeagueGroup(groupInfos, eventLeagueData, summaryEventLeagueData, siteIdList, ref eventLeagueList);

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
            var leagueGroupList = SessionManager.Get<Dictionary<int, LeagueGroup>>(Consts.AutomationTradingLeagueGroupsSessionKey);

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
            string reportName = string.Format(
                                ViewLang.AutomationTradingPerformanceFileName,
                                ViewLang.Event,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());

            var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.Event);
            var sheet = writer.CopyRows(0, 1).Sheet;

            var columns = new List<object>
                {
                    ViewLang.Event,
                    ViewLang.Match,
                    ViewLang.BetCount
                };

            FilterBlock(userId, criteria, string.Empty, ref writer);

            writer.FreezeRow(0, 4);

            if (eventLeagueList.ItemList.Any())
            {
                FillGroupHeader(eventLeagueList.GroupHeaderList, eventLeagueList.GrandTotal.RobotTradingItemList, columns, 3, ref writer);
                FillRowDataEventLeague(eventLeagueList.ItemList, 3, ref writer);
                FillGrandTotal(eventLeagueList.GrandTotal, 3, ref writer);
            }
            else
            {
                GenerateEventLeagueListDefault(criteria, ref eventLeagueList);

                FillGroupHeader(eventLeagueList.GroupHeaderList, eventLeagueList.GrandTotal.RobotTradingItemList, columns, 3, ref writer);
                FillRowDataEmpty(eventLeagueList.GrandTotal.RobotTradingItemList, 3, ref writer);
            }

            // Adjust column width for sheet
            sheet.SetColumnWidth(0, 9216);
            for (int i = 1; i < columns.Count; i++)
            {
                sheet.SetColumnWidth(i, 4096);
            }

            writer.Render();
        }

        private void GenerateEventLeagueListDefault(GetLeaguePerformanceOfEventCriteria criteria, ref AutoTradingList eventLeagueList)
        {
            var siteIdList = Array.ConvertAll(criteria.TypeSiteIds.Split(','), x => int.Parse(x)).ToList();

            eventLeagueList.GenerateGroupHeader(criteria.Measurements, criteria.TypeSiteIds)
                           .GenerateMeasurementHidden(criteria.MeasurementHides);

            eventLeagueList.AddAutoTradingItem(siteIdList,
                            new List<RTModelPerformanceInfo>(),
                            new SummaryLeagueMatchBetCountInfo(),
                            string.Empty,
                            AutoTradingType.LeagueGroup);

            eventLeagueList.GenerateGrandTotal(AutoTradingType.LeagueGroup, false);
        }

        private void FillRowDataEmpty(IDictionary<string, RobotTradingItem> robotTradingItemList, int columnCount, ref ExcelTemplateWriter writer)
        {
            columnCount += robotTradingItemList.Count(x => !x.Value.IsHideMargin);
            columnCount += robotTradingItemList.Count(x => !x.Value.IsHideTurnover);
            columnCount += robotTradingItemList.Count(x => !x.Value.IsHideWinLoss);

            var row = writer.CopyRows(14, 1);
            SheetExtensions.MergeCells(row.Sheet, 4, 0, 4, columnCount - 1);
            row.GetCell(0).SetCellValue(Messages.ThereIsNoData);
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
            var matchList = GetAutoTradingMatchPerformance(criteria);

            SessionManager.Set<AutoTradingList>(Consts.AutomationTradingMatchPerformanceOfEventLeagueSessionKey, matchList);

            return matchList;
        }

        private AutoTradingList GetAutoTradingMatchPerformance(AutoTradingPerformanceCriteria criteria)
        {
            var matchList = new AutoTradingList();

            using (var objectDb = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria))
                {
                    var summaryMatchOfEventLeague = multi.Read<SummaryMatchOfEventLeagueInfo>();
                    var matchData = multi.Read<MatchPerformanceOfEventLeagueInfo>();

                    if (matchData != null && matchData.Any())
                    {
                        matchList.GenerateGroupHeader(criteria.Measurements, criteria.TypeSiteIds)
                                  .GenerateMeasurementHidden(criteria.MeasurementHides);

                        var siteIdList = Array.ConvertAll(criteria.TypeSiteIds.Split(','), x => int.Parse(x)).ToList();

                        var groupInfos = matchData.GroupBy(x => x.MatchId, (key, g) => new { MatchId = key, Items = g.ToList() });

                        foreach (var grouping in groupInfos)
                        {
                            var summaryMatchOfEventLeagueInfo = summaryMatchOfEventLeague.FirstOrDefault(x => x.MatchId.Equals(grouping.MatchId));
                            var matchName = CacheRef.GetTeamName(summaryMatchOfEventLeagueInfo.HomeId) + " " + ViewLang.Vs + " " + CacheRef.GetTeamName(summaryMatchOfEventLeagueInfo.AwayId);

                            matchList.AddAutoTradingItem(
                                                siteIdList,
                                                grouping.Items,
                                                summaryMatchOfEventLeagueInfo,
                                                summaryMatchOfEventLeagueInfo.EventDate.ToString(Consts.FormatDateTimeToString_yyyyMMdd),
                                                AutoTradingType.Match,
                                                matchName);
                        }

                        matchList.GenerateGrandTotal(true);
                    }
                }
            }

            return matchList;
        }

        public string GetMatchIdListFromSession(string conditionKey, string sessionKey)
        {
            var autoTradingList = SessionManager.Get<AutoTradingList>(sessionKey);

            if (autoTradingList != null)
            {
                return autoTradingList.ItemList.FirstOrDefault(x => x.AutoTradingName.Equals(conditionKey)).MatchIdList;
            }

            return string.Empty;
        }

        public void ExportAutoTradingMatchPerformanceOfEventLeague(int userId, GetMatchPerformanceOfEventLeagueCriteria criteria, string templatePath, string breadcrumb)
        {
            var matchList = SessionManager.Get<AutoTradingList>(Consts.AutomationTradingMatchPerformanceOfEventLeagueSessionKey);

            ExportAutoTradingMatchPerformance(matchList, userId, criteria, templatePath, breadcrumb);
        }

        private void ExportAutoTradingMatchPerformance(AutoTradingList matchList, int userId, AutoTradingPerformanceCriteria criteria, string templatePath, string breadcrumb)
        {
            if (matchList != null && matchList.ItemList.Any())
            {
                string reportName = string.Format(
                                ViewLang.AutomationTradingPerformanceFileName,
                                ViewLang.Match,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());

                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.Match);
                var sheet = writer.CopyRows(0, 1).Sheet;

                var columns = new List<object>
                {
                    ViewLang.EventDate,
                    ViewLang.Match,
                    ViewLang.BetCount
                };

                FillDataReport(matchList, criteria, userId, columns, breadcrumb, ref writer);

                // Adjust column width for sheet   
                sheet.SetColumnWidth(0, 4096);
                sheet.SetColumnWidth(1, 8192);
                for (int i = 2; i < columns.Count; i++)
                {
                    sheet.SetColumnWidth(i, 4096);
                }

                writer.Render();
            }
        }

        private void FillDataReport(AutoTradingList autoTradingList,
            AutoTradingPerformanceCriteria criteria,
            int userId,
            List<object> columns,
            string breadcrumb,
            ref ExcelTemplateWriter writer)
        {
            var cellCopyIndex = columns.Count;

            FilterBlock(userId, criteria, breadcrumb, ref writer);

            writer.FreezeRow(0, 4);

            FillGroupHeader(autoTradingList.GroupHeaderList, autoTradingList.GrandTotal.RobotTradingItemList, columns, cellCopyIndex, ref writer);
            FillRowData(autoTradingList.ItemList, cellCopyIndex, ref writer);
            FillGrandTotal(autoTradingList.GrandTotal, cellCopyIndex, ref writer);
        }

        #endregion
    }
}