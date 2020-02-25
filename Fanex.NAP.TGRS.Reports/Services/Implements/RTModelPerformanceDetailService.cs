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
    using Fanex.NAP.TGRS.Reports.Criteria.RTModelPerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.RTModelPerformanceDetail;
    using Fanex.NAP.TGRS.Reports.ViewModels.RTModelPerformanceDetail;
    using NPOI.SS.UserModel;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;

    public class RTModelPerformanceDetailService : TGRSBaseService, IRTModelPerformanceDetailService
    {
        #region Consts
        private const string RTModelLeagueGroupsSessionKey = "Fanex.NAP.TGRS.Reports.RTModelPerformanceDetail.LeagueGroups";
        private const string RTModelBetTypeListSessionKey = "Fanex.NAP.TGRS.Reports.RTModelPerformanceDetail.BetTypeList";
        private const string RTModelMonthPerformanceSessionKey = "Fanex.NAP.TGRS.Reports.RTModelPerformanceDetail.MonthlyList";
        private const string RTModelPerformanceSessionKey = "Fanex.NAP.TGRS.Reports.RTModelPerformanceDetail.ModelList";
        private const int PointInPixel = 225;
        #endregion

        #region Bet Type
        public Dictionary<int, string> GetLeagueGroups()
        {
            var leagueGroups = new Dictionary<int, string>();
            leagueGroups.Add(1, Consts.RobotTradingLeagueGroupMJ);
            leagueGroups.Add(2, Consts.RobotTradingLeagueGroupM2);
            leagueGroups.Add(3, Consts.RobotTradingLeagueGroupM3);
            leagueGroups.Add(4, Consts.RobotTradingLeagueGroupM4);
            leagueGroups.Add(5, Consts.RobotTradingLeagueGroupM5);
            leagueGroups.Add(6, Consts.RobotTradingLeagueGroupOthers);
            SessionManager.Set<Dictionary<int, string>>(RTModelLeagueGroupsSessionKey, leagueGroups);

            return leagueGroups;
        }

        public BetTypeList GetBetTypePerformance(GetBetTypePerformanceCriteria criteria)
        {
            var betTypeList = new BetTypeList();
            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    var totalLeagueMatchData = multi.Read<TotalLeagueMatchInfo>();
                    var matchCountData = multi.Read<MatchBetCountInfo>();
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
                                var matchCountInfo = matchCountData.Where(x => x.BetType == betTypeId).FirstOrDefault();
                                var betTypeInfos = betTypesData.Where(x => x.BetType == betTypeId).OrderByDescending(x => x.TypeSiteId);

                                betTypeList.AddBetTypeItem(siteIdList, betTypeInfos, matchCountInfo, betTypeId);
                            }
                        }
                        
                        betTypeList.GenerateGrandTotal();                        

                        SessionManager.Set<BetTypeList>(RTModelBetTypeListSessionKey, betTypeList);
                    }
                }
            }

            return betTypeList;
        }      

        public void ExportBetTypePerformance(int userId, GetBetTypePerformanceCriteria criteria, string templatePath)
        {
            var betTypeData = SessionManager.Get<BetTypeList>(RTModelBetTypeListSessionKey);

            if (betTypeData != null && betTypeData.ItemList.Any())
            {
                string reportName = string.Format(
                                ViewLang.RTModelPerformanceDetailFileName,
                                ViewLang.BetTypeExcelFile,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());

                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.BetType);

                var sheet = writer.CopyRows(0, 1).Sheet;
                FilterBlockBetType(userId, criteria, ref writer);

                writer.FreezeRow(0, 4);
                var columns = GenerateBetTypeColumns();

                FillGroupHeader(betTypeData.GroupHeaderList, betTypeData.GrandTotal.RobotTradingItemList, columns, ref writer);
                FillRowDataBetType(betTypeData.ItemList, ref writer);
                FillGrandTotalBetType(betTypeData.GrandTotal, ref writer);

                // Set column with for sheet
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

        private List<object> GenerateBetTypeColumns()
        {
            return new List<object>
            {
                ViewLang.BetType,
                ViewLang.Match,
                ViewLang.BetCount
            };
        }

        private void FillGroupHeader(IList<GroupHeader> groupHeaderList, 
            IDictionary<string, RobotTradingItem> robotTradingItemList,
            List<object> columns,
            ref ExcelTemplateWriter writer)
        {
            var rowGroupHeader = writer.CopyRows(3, 1);
            var rowHeader = FillHeader(robotTradingItemList, ref writer);

            var cellMergeStartIndex = 3;
            var cellMergeEndIndex = 3;
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

            writer.SetRowValue(rowGroupHeader, columns.ToArray(), 3);

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

            var columns = new List<object> { string.Empty, string.Empty, string.Empty };
           
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

            writer.SetRowValue(row, columns.ToArray(), 3);

            SheetExtensions.MergeCells(row.Sheet, 2, 0, 3, 0);
            SheetExtensions.MergeCells(row.Sheet, 2, 1, 3, 1);
            SheetExtensions.MergeCells(row.Sheet, 2, 2, 3, 2);

            return row;
        }

        private void FillRowDataBetType(IList<BetTypeItem> itemList, ref ExcelTemplateWriter writer)
        {
            var index = 1;

            foreach (var betTypeItem in itemList)
            {
                int styleIndex = index % 2 == 0 ? 6 : 5;
                var columns = new List<object>
                {
                    betTypeItem.BetTypeName,
                    betTypeItem.MatchCount,
                    betTypeItem.BetCount
                };              

                FillRowData(betTypeItem.RobotTradingItemList, columns, styleIndex, ref writer);

                index++;
            }
        }

        private void FillGrandTotalBetType(BetTypeItem grandTotal, ref ExcelTemplateWriter writer)
        {
            var columns = new List<object>
            {
                ViewLang.GrandTotal,
                grandTotal.MatchCount,
                grandTotal.BetCount
            };            

            FillRowData(grandTotal.RobotTradingItemList, columns, 7, ref writer);          
        }

        private void FillRowData(IDictionary<string, RobotTradingItem> robotTradingItemList,
           List<object> columns,
           int styleIndex,
           ref ExcelTemplateWriter writer)
        {
            var i = 3;
            var marginListIndex = new List<int>();

            foreach (var robotTradingItem in robotTradingItemList)
            {
                if (!robotTradingItem.Value.IsHideTurnover)
                {
                    columns.Add(robotTradingItem.Value.Turnover);
                    i++;
                }
                if (!robotTradingItem.Value.IsHideWinLoss)
                {
                    columns.Add(robotTradingItem.Value.WinLoss);
                    i++;
                }
                if (!robotTradingItem.Value.IsHideMargin)
                {
                    columns.Add(robotTradingItem.Value.Margin);                    
                    marginListIndex.Add(i);
                    i++;
                }
            }
         
            var row = writer.CreateRow(styleIndex, columns.ToArray(), 3);
        }

        #endregion

        #region Monthly

        public MonthlyList GetMonthPerformance(GetMonthPerformanceCriteria criteria)
        {
            var monthlyList = new MonthlyList();
            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria.GetSpParams()))
                {
                    var totalLeagueMatchData = multi.Read<TotalLeagueMatchInfo>();
                    var matchCountData = multi.Read<MatchBetCountInfo>();
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

                                var matchCountInfo = matchCountData.Where(x => x.RptMonth == group.RptMonth).FirstOrDefault();

                                monthlyList.AddMonthlyItem(siteIdList, group.Items, matchCountInfo, group.RptMonth);
                            }

                            monthlyList.GenerateGrandTotal();
                        }

                        SessionManager.Set<MonthlyList>(RTModelMonthPerformanceSessionKey, monthlyList);
                    }
                }
            }

            return monthlyList;
        }

        public void ExportMonthPerformance(int userId, GetMonthPerformanceCriteria criteria, string templatePath)
        {
            var monthData = SessionManager.Get<MonthlyList>(RTModelMonthPerformanceSessionKey);

            if (monthData != null && monthData.ItemList.Any())
            {
                string reportName = string.Format(
                                ViewLang.RTModelPerformanceDetailFileName,
                                ViewLang.Month,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());

                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.Month);
                var sheet = writer.CopyRows(0, 1).Sheet;

                FilterBlockMonth(userId, criteria, ref writer);

                writer.FreezeRow(0, 4);
                var columns = GenerateMonthlyColumns();

                FillGroupHeader(monthData.GroupHeaderList, monthData.GrandTotal.RobotTradingItemList, columns, ref writer);
                FillRowDataMonth(monthData.ItemList, ref writer);
                FillGrandTotalMonth(monthData.GrandTotal, ref writer);

                // Set column with for sheet
                for (int i = 0; i < columns.Count; i++)
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

        private List<object> GenerateMonthlyColumns()
        {
            return new List<object>
            {
                ViewLang.Month,
                ViewLang.Match,
                ViewLang.BetCount
            };
        }

        private void FillRowDataMonth(IList<MonthlyItem> itemList, ref ExcelTemplateWriter writer)
        {
            var index = 1;

            foreach (var monthlyItem in itemList)
            {
                int styleIndex = index % 2 == 0 ? 6 : 5;
                var columns = new List<object>
                {
                    monthlyItem.Monthly,
                    monthlyItem.MatchCount,
                    monthlyItem.BetCount
                };
               
                FillRowData(monthlyItem.RobotTradingItemList, columns, styleIndex, ref writer);

                index++;
            }
        }

        private void FillGrandTotalMonth(MonthlyItem grandTotal, ref ExcelTemplateWriter writer)
        {
            var columns = new List<object>
            {
                ViewLang.GrandTotal,
                grandTotal.MatchCount,
                grandTotal.BetCount
            };

            FillRowData(grandTotal.RobotTradingItemList, columns, 7, ref writer);
        }       

        #endregion

        #region Model
        public ModelPerformanceList GetModelPerformance(GetModelPerformanceCriteria criteria)
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

                            SessionManager.Set<ModelPerformanceList>(RTModelPerformanceSessionKey, modelPerformanceList);
                        }
                    }
                }
            }

            return modelPerformanceList;
        }

        public void ExportModelPerformance(int userId, GetModelPerformanceCriteria criteria, string templatePath)
        {
            var modelData = SessionManager.Get<ModelPerformanceList>(RTModelPerformanceSessionKey);

            if (modelData != null && modelData.ItemList.Any())
            {
                string reportName = string.Format(
                        ViewLang.RTModelPerformanceDetailFileName,
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
            var leagueGroups = SessionManager.Get<Dictionary<int, string>>(RTModelLeagueGroupsSessionKey);
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