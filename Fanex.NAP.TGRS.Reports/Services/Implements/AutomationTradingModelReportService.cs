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
        private const string AutomationTradingModelPerformanceSessionKey = "Fanex.NAP.TGRS.Reports.AutomationTradingPerformance.ModelList";
        #endregion

        #region Model
        public ModelPerformanceList GetAutoTradingModelPerformance(GetModelPerformanceCriteria criteria)
        {
            var modelPerformanceList = new ModelPerformanceList();
            using (var objectDb = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria))
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
            if (string.IsNullOrEmpty(leagueGroupIds))
            {
                return ViewLang.All;
            }
            var leagueGroups = SessionManager.Get<Dictionary<int, LeagueGroup>>(Consts.AutomationTradingLeagueGroupsSessionKey);
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