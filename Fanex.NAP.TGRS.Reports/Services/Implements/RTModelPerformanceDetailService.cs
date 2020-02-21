namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.Data;
    using Fanex.Data.Repository;
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Consts;
    using Fanex.NAP.TGRS.Core.ExcelUtility;
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
                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.RTModelPerformanceDetail);
                writer.CopyRows(0, 1);
                FilterBlock(userId, criteria, ref writer);
                FillBetTypeHeader(ref writer);
                writer.FreezeRow(0, 4);
                FillRowDataBetType(betTypeData, ref writer);

                writer.Render();
            }
        }

        private void FillBetTypeHeader(ref ExcelTemplateWriter writer)
        {
            writer.CopyRows(3, 2);
        }

        private void FillRowDataBetType(BetTypeList data, ref ExcelTemplateWriter writer)
        {            
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
            //var monthData = SessionManager.Get<MonthPerformanceList>(RTModelMonthPerformanceSessionKey);
            //if (monthData != null && monthData.ItemList.Any())
            //{
            //    string reportName = string.Format(
            //                    ViewLang.RTModelPerformanceDetailFileName,
            //                    ViewLang.Month,
            //                    criteria.FromDate.ToShortFormatedDateForFileName(),
            //                    criteria.ToDate.ToShortFormatedDateForFileName());
            //    var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.RTModelPerformanceDetail);
            //    writer.CopyRows(0, 1);
            //    FilterBlock(userId, criteria, ref writer);
            //    FillHeader(ref writer);
            //    writer.FreezeRow(0, 4);
            //    FillRowDataMonth(monthData, ref writer);
            //    writer.SyncColumnsWidth(17);
            //    writer.Render();
            //}
        }

        #endregion

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
                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.RTModelPerformanceDetail);
                writer.CopyRows(0, 1);
                FilterBlock(userId, criteria, ref writer);
                FillHeader(ref writer, criteria.DataType == ViewLang.Percentage);
                writer.FreezeRow(0, 4);
                FillRowDataModel(modelData, ref writer, criteria.DataType);
                writer.SyncColumnsWidth(17);
                writer.Render();
            }
        }

        [SuppressMessage("StyleCop.CSharp.StylecopPlus.Rules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Need to review here.")]
        private void FilterBlock(int userId, ICriteria rt3criteria, ref ExcelTemplateWriter writer)
        {
            RichTextRender contentRender = new RichTextRender().Clear();
            IFont boldFont = writer.GetFont(11, 0);
            IFont normalFont = writer.GetFont(12, 0);
            int lineCount = 0;

            if (rt3criteria is GetModelPerformanceCriteria)
            {
                var criteria = rt3criteria as GetModelPerformanceCriteria;
                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");
                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.DataType, boldFont, criteria.DataType, normalFont, "\n");
            }
            else
            {
                var criteria = rt3criteria as GetBetTypePerformanceCriteria;
                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");
                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.LeagueGroup, boldFont, GetLeagueGroupNames(criteria.LeagueGroupIds), normalFont, "\n");
            }

            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(8, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }

        private void FillHeader(ref ExcelTemplateWriter writer)
        {
            FillHeader(ref writer, false);
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

        private void FillRowDataMonth(MonthlyList data, ref ExcelTemplateWriter writer)
        {
            
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
            } else
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

        private string GetLeagueGroupNames(string leagueGroupIds)
        {
            var leagueGroups = SessionManager.Get<Dictionary<int, string>>(RTModelLeagueGroupsSessionKey);
            var leagueGroupIdList = Array.ConvertAll(leagueGroupIds.Split(','), s => Int16.Parse(s)).ToList();           
            var leagueGroupNames = leagueGroups.Join(leagueGroupIdList, a => a.Key, b => b, (a, b) => a.Value);

            return string.Join(",", leagueGroupNames);
        }
    }
}