namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.Data.Repository;
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.ExcelUtility;
    using Fanex.NAP.TGRS.Core.ExcelUtility.RichTextExtensions;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Criteria.RT3PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.ViewModels.RT3PerformanceDetail;
    using NPOI.SS.UserModel;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;

    public class RT3PerformanceDetailService : TGRSBaseService, IRT3PerformanceDetailService
    {
        private const int PointInPixel = 225;

        public BetTypePerformanceList GetBetTypePerformance(ICriteria criteria)
        {
            return GenerateSampleBetTypePerformance();

        }
       
        public BetTypePerformanceList GenerateSampleBetTypePerformance()
        {
            var betTypeList = new BetTypePerformanceList();
            betTypeList.ItemList = new List<BetTypePerformanceItem>();
            betTypeList.GrandTotal = new BetTypePerformanceItem();

            for (int i = 0; i < 5; i++)
            {
                betTypeList.ItemList.Add(new BetTypePerformanceItem
                {
                    BetTypeId = 1,
                    BetTypeName = "1H HDP",
                    BetCount = 5156,
                    VirtualTotalTurnover = 3227325,
                    VirtualTotalWinLoss = 11553824,
                    VirtualTotalMargin = 3227325/ 11553824 * 100
                });
            }

            return betTypeList;
        }

        public void ExportBetTypePerformance(int userId, GetBetTypePerformanceCriteria criteria, string templatePath)
        {
            var betTypeData = GetBetTypePerformance(criteria);

            if (betTypeData != null && betTypeData.ItemList.Any())
            {
                string reportName = string.Format(
                                ViewLang.RT3PerformanceDetailFileName,
                                ViewLang.BetType,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());
                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.RT3PerformanceDetail);
                writer.CopyRows(0, 1);
                FilterBlock(userId, criteria, ref writer);
                FillHeader(ref writer);
                writer.FreezeRow(0, 4);
                FillRowDataBetType(betTypeData, ref writer);
                writer.SyncColumnsWidth(10);
                writer.Render();
            }
        }

        public MonthPerformanceList GetMonthPerformance(ICriteria criteria)
        {
            return GenerateSampleMonthPerformance();
        }

        public MonthPerformanceList GenerateSampleMonthPerformance()
        {
            var monthList = new MonthPerformanceList();
            monthList.ItemList = new List<MonthPerformanceItem>();
            monthList.GrandTotal = new MonthPerformanceItem();

            monthList.ItemList.Add(new MonthPerformanceItem
            {
                Month = "Oct-19",
                Match = 15620,
                BetCount = 11500,
                VirtualTotalTurnover = 593749,
                VirtualTotalWinLoss = 1353747,
                VirtualTotalMargin = 593749 / 1353747 * 100
            });
            monthList.ItemList.Add(new MonthPerformanceItem
            {
                Month = "Nov-19",
                Match = 16708,
                BetCount = 15700,
                VirtualTotalTurnover = 3277325,
                VirtualTotalWinLoss = 11553842,
                VirtualTotalMargin = 3277325 / 11553842 * 100
            });

            return monthList;
        }        

        public void ExportMonthPerformance(int userId, GetMonthPerformanceCriteria criteria, string templatePath)
        {
            var monthData = GetMonthPerformance(criteria);

            if (monthData != null && monthData.ItemList.Any())
            {
                string reportName = string.Format(
                                ViewLang.RT3PerformanceDetailFileName,
                                ViewLang.BetType,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());
                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.RT3PerformanceDetail);
                writer.CopyRows(0, 1);
                FilterBlock(userId, criteria, ref writer);
                FillHeader(ref writer);
                writer.FreezeRow(0, 4);
                FillRowDataMonth(monthData, ref writer);
                writer.SyncColumnsWidth(10);
                writer.Render();
            }
        }

        private void FillHeader(ref ExcelTemplateWriter writer)
        {
            writer.CopyRows(3, 2);            
        }

        [SuppressMessage("StyleCop.CSharp.StylecopPlus.Rules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Need to review here.")]
        private void FilterBlock(int userId, RT3PerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            RichTextRender contentRender = new RichTextRender().Clear();
            IFont boldFont = writer.GetFont(11, 0);
            IFont normalFont = writer.GetFont(12, 0);
            int lineCount = 0;
            
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");                      

            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(8, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
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

        private void FillRowDataBetType(BetTypePerformanceList data, ref ExcelTemplateWriter writer)
        {
            var index = 1;
            foreach (var item in data.ItemList)
            {
                int styleIndex = index % 2 == 0 ? 6 : 5;
                var record = new object[]
                {
                        item.BetTypeName,
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
            var totalRecord = new object[]
                {
                    ViewLang.GrandTotal,
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

        private void FillRowDataMonth(MonthPerformanceList data, ref ExcelTemplateWriter writer)
        {
            var index = 1;
            foreach (var item in data.ItemList)
            {
                int styleIndex = index % 2 == 0 ? 6 : 5;
                var record = new object[]
                {
                    item.Month,
                    item.Match,
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
            var totalRecord = new object[]
                {
                    ViewLang.GrandTotal,                    
                    total.Match,
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
    }
}