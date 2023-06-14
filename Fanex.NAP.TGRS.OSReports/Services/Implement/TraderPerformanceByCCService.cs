namespace Fanex.NAP.TGRS.OSReports.Services.Implement
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.ExcelUtility;
    using Fanex.NAP.TGRS.Core.ExcelUtility.RichTextExtensions;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.OSReports.Criteria.SportPerformance;
    using Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformanceByCC;
    using Fanex.NAP.TGRS.OSReports.Models.TraderPerformanceByCC;
    using Fanex.NAP.TGRS.OSReports.Services.Interface;
    using NPOI.SS.UserModel;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class TraderPerformanceByCCService : TGRSBaseService, ITraderPerformanceByCCService
    {
        private const int PointInPixel = 225;
        private const string DecimalFormat = "0.00";
        private const string ShortDateFormatForFileName = "yyyyMMdd";

        public IEnumerable<TraderPerformanceByCCModel> GetTraderPerformancesByCC(GetTraderPerformanceByCCCriteria criteria)
        {
            var result = GetData<TraderPerformanceByCCModel>(criteria);

            if (result != null && result.Any())
            {
                return result;
            }

            return Enumerable.Empty<TraderPerformanceByCCModel>();
        }

        public IEnumerable<SportModel> GetSportFilter()
        {
            var result = this.GetData<SportModel>(new GetAllSportsCriteria());

            if (result != null && result.Any())
            {
                result = result.Where(c => c.SportId == 2 || c.SportId == 43);
            }

            return result ?? new List<SportModel>();
        }

        public CustomerClassGroupViewModel GetCTSCustomerClassFilter()
        {
            var data = GetData<CustomerClassModel>(new GetCTSCustomerClassCriteria());

            var result = new CustomerClassGroupViewModel();

            if (data != null && data.Any())
            {
                result.CustomerClassGroup = data.GroupBy(c => new { c.CustomerClassGroupID, c.CustomerClassGroupName })
                                                 .Select(x => new { Group = x.Key, ClassList = x.ToList() })
                                                 .Select(x => new CustomerClassViewModel
                                                 {
                                                    CustomerClassGroupID = x.Group.CustomerClassGroupID,
                                                    CustomerClassGroupName = x.Group.CustomerClassGroupName,
                                                    ClassList = x.ClassList.Select(z => z.CustomerClass)
                                                 }).ToList();

                result.ClassList = string.Join(",", data.ToList().Select(c => c.CustomerClass).Distinct());
            }

            return result;
        }

        public void ExportTradePerformanceCC(ExportExcelTradePerfCCViewModel exportModel, string templatePath)
        {
            var data = GetTraderPerformancesByCC(new GetTraderPerformanceByCCCriteria 
            {
                TraderName = exportModel.TraderName,
                CustomerClassIds = exportModel.CustomerClassIds,
                AllCustomerClassIds = exportModel.AllCustomerClassIds,
                SportId = exportModel.SportId,
                FromDate = exportModel.FromDate,
                ToDate = exportModel.ToDate
            });

            var reportName = string.Format(
                                ViewLang.TraderPerformanceByCC,
                                exportModel.FromDate.ToString(ShortDateFormatForFileName),
                                exportModel.ToDate.ToString(ShortDateFormatForFileName));

            var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.TraderPerformanceByCC_SheetName);
            writer.CopyRows(0, 1);
            FilterBlock(exportModel, ref writer);
            FillHeader(ref writer);
            writer.FreezeRow(0, 4);
            FillRowData(data, ref writer);
            writer.SyncColumnsWidth(10);

            writer.Render();
        }

        #region Private Method

        private void FilterBlock(ExportExcelTradePerfCCViewModel exportModel, ref ExcelTemplateWriter writer)
        {
            var contentRender = new RichTextRender().Clear();
            var boldFont = writer.GetFont(10, 0);
            var normalFont = writer.GetFont(11, 0);
            var lineCount = 0;

            AppendBlockContent(ref contentRender, ref lineCount, "From Date", boldFont, exportModel.FromDate.ToString("MM/dd/yyyy"), normalFont, " - ");
            AppendBlockContent(ref contentRender, ref lineCount, "To Date", boldFont, exportModel.ToDate.ToString("MM/dd/yyyy"), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, "Sport Type", boldFont, exportModel.SportName, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, "Customer Class", boldFont, exportModel.DisplayCustomerClassIds, normalFont, "\n");

            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(1, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }

        private void AppendBlockContent(ref RichTextRender content, ref int lineCount, string name, IFont nameFont, string value, IFont valueFont, string endString)
        {
            if (string.IsNullOrEmpty(value))
            {
                return;
            }

            var nameBlock = new TextBlock(name + ":  ", nameFont);
            content = content.AddText(nameBlock);

            var valueBlock = new TextBlock(value, valueFont);
            content = content.AddText(valueBlock);

            if (!string.IsNullOrEmpty(endString))
            {
                content = content.AddText(endString);
            }

            lineCount += CountLine(name + value);
        }

        private int CountLine(string line)
        {
            const int CharPerLine = 216;
            return Convert.ToInt32(Math.Ceiling((float)line.Length / CharPerLine));
        }

        private void FillHeader(ref ExcelTemplateWriter writer)
        {
            writer.CopyRows(2, 2);
        }

        private void FillRowData(IEnumerable<TraderPerformanceByCCModel> data, ref ExcelTemplateWriter writer)
        {
            for (var i = 0; i < data.Count(); i++)
            {
                var styleIndex = (i % 2 == 0) ? 4 : 5;
                var item = data.ElementAt(i);

                var record = new object[]
                {
                    i + 1,
                    item.TraderName,
                    (object)item.CustomerClass ?? ViewLang.NA,
                    (object)item.MarginReal ?? ViewLang.NA,
                    (object)item.TurnoverReal ?? ViewLang.NA,
                    (object)item.WinLossReal ?? ViewLang.NA,
                    (object)item.Margin ?? ViewLang.NA,
                    (object)item.Turnover ?? ViewLang.NA,
                    (object)item.WinLoss ?? ViewLang.NA,
                    (object)item.BetCount ?? ViewLang.NA,
                };

                writer.WriteRow(styleIndex, record);
            }
        }

        #endregion
    }
}