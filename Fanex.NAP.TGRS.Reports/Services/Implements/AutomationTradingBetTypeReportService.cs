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
        #region Consts
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

            SessionManager.Set<Dictionary<int, LeagueGroup>>(Consts.AutomationTradingLeagueGroupsSessionKey, leagueGroups);

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
                        betTypeList.GenerateLeagueMatchTotal(totalLeagueMatchData.ToList()[0])
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

                                betTypeList.AddAutoTradingItem(siteIdList, betTypeInfos, summaryBetType, betTypeName, AutoTradingType.BetType, betTypeId.ToString());
                            }
                        }

                        betTypeList.GenerateGrandTotal();

                        SessionManager.Set<AutoTradingList>(Consts.AutomationTradingBetTypeListSessionKey, betTypeList);
                    }
                }
            }

            return betTypeList;
        }

        public void ExportAutoTradingBetTypePerformance(int userId, GetBetTypePerformanceCriteria criteria, string templatePath)
        {
            var betTypeData = SessionManager.Get<AutoTradingList>(Consts.AutomationTradingBetTypeListSessionKey);

            if (betTypeData != null && betTypeData.ItemList.Any())
            {
                string reportName = string.Format(
                                ViewLang.AutomationTradingPerformanceFileName,
                                ViewLang.BetTypeExcelFile,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());

                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.BetType);

                var sheet = writer.CopyRows(0, 1).Sheet;
                
                var columns = new List<object>
                {
                    ViewLang.BetType,
                    ViewLang.League,
                    ViewLang.Match,
                    ViewLang.BetCount
                };

                FilterBlockBetType(userId, criteria, ref writer);

                writer.FreezeRow(0, 4);

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

        public AutoTradingList GetAutoTradingLeaguePerformanceOfBetType(GetLeaguePerformanceOfBetTypeCriteria criteria)
        {
            var leagueList = GetAutoTradingLeaguePerformance(criteria);

            SessionManager.Set<AutoTradingList>(Consts.AutomationTradingLeaguePerformanceOfBetTypeSessionKey, leagueList);

            return leagueList;
        }

        public void ExportAutoTradingLeaguePerformanceOfBetType(int userId, GetLeaguePerformanceOfBetTypeCriteria criteria, string templatePath, string breadcrumb)
        {
            var leagueList = SessionManager.Get<AutoTradingList>(Consts.AutomationTradingLeaguePerformanceOfBetTypeSessionKey);

            ExportAutoTradingLeaguePerformance(leagueList, userId, criteria, templatePath, breadcrumb);
        }

        public AutoTradingList GetAutoTradingMatchPerformanceOfBetTypeLeague(GetMatchPerformanceOfBetTypeLeagueCriteria criteria)
        {
            var matchList = GetAutoTradingMatchPerformance(criteria);

            SessionManager.Set<AutoTradingList>(Consts.AutomationTradingMatchPerformanceOfBetTypeLeagueSessionKey, matchList);

            return matchList;
        }

        public void ExportAutoTradingMatchPerformanceOfBetTypeLeague(int userId, GetMatchPerformanceOfBetTypeLeagueCriteria criteria, string templatePath, string breadcrumb)
        {
            var matchList = SessionManager.Get<AutoTradingList>(Consts.AutomationTradingMatchPerformanceOfBetTypeLeagueSessionKey);

            ExportAutoTradingMatchPerformance(matchList, userId, criteria, templatePath, breadcrumb);
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
                var columns = new List<object>();
                
                if (item.Type.Equals(AutoTradingType.Match))
                {
                    columns = new List<object>()
                    {
                        item.AutoTradingName,
                        item.AutoTradingName2,
                        item.BetCount
                    };
                }
                else
                {
                    columns = cellCopyIndex.Equals(4)
                        ? new List<object>() {
                            item.AutoTradingName,
                            item.LeagueCount,
                            item.MatchCount,
                            item.BetCount
                        }
                        : new List<object>() {
                            item.AutoTradingName,
                            item.MatchCount,
                            item.BetCount
                        };
                }
                
                FillRowData(item.RobotTradingItemList, columns, styleIndex, columns.Count, ref writer);

                index++;
            }
        }

        private void FillGrandTotal(AutoTradingItem grandTotal,
            int cellCopyIndex,
            ref ExcelTemplateWriter writer)
        {
            var columns = new List<object>();
            if (grandTotal.Type.Equals(AutoTradingType.Match))
            {
                columns = new List<object>()
                    {
                        ViewLang.GrandTotal,
                        grandTotal.BetCount
                    };
            }
            else
            {
                columns = cellCopyIndex == 4
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
            }

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
                
    }
}