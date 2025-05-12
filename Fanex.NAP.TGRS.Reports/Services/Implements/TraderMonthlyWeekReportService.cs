using System.Linq;

namespace Fanex.NAP.TGRS.Reports.Services.Implements
{
    using Fanex.NAP.TGRS.Reports.Models.TraderPerformanceMonthly;
    using OfficeOpenXml;
    using System;
    using System.Collections.Generic;
    using System.IO;

    public class TraderMonthlyWeekReportService : IDisposable
    {
        private readonly ExcelPackage excelPackage;

        private readonly ExcelWorksheet mainTemplate;
        private readonly ExcelWorksheet mainSheet;
        private readonly ExcelWorksheet monthCoverageTemplate;
        private readonly ExcelWorksheet monthCoverageSheet;
        private readonly ExcelWorksheet weekCoverageTemplate;
        private readonly ExcelWorksheet weekCoverageSheet;

        private readonly TraderMonthlyWeekMainSheetExcelService mainSheetService;
        private readonly TraderMonthlyWeekMonthCoverageSheetExcelService monthCoverageSheetService;
        private readonly TraderMonthlyWeekWeekCoverageSheetExcelService weekCoverageSheetService;

        public TraderMonthlyWeekReportService(string templatePath, int year, List<int> months, List<int> weeks, List<TraderPerformanceWeekRawData> rawData)
        {
            excelPackage = new ExcelPackage(new FileInfo(templatePath));
            mainTemplate = excelPackage.Workbook.Worksheets["Sheet1"];
            mainSheet = excelPackage.Workbook.Worksheets.Add("Trader Monthly Performance", mainTemplate);
            monthCoverageTemplate = excelPackage.Workbook.Worksheets["Sheet2"];
            monthCoverageSheet = excelPackage.Workbook.Worksheets.Add("Saba Match Coverage-Month", monthCoverageTemplate);
            weekCoverageTemplate = excelPackage.Workbook.Worksheets["Sheet3"];
            weekCoverageSheet = excelPackage.Workbook.Worksheets.Add("Saba Match Coverage-Week", weekCoverageTemplate);

            mainSheetService = new TraderMonthlyWeekMainSheetExcelService(mainTemplate, mainSheet, year, months, rawData);
            monthCoverageSheetService = new TraderMonthlyWeekMonthCoverageSheetExcelService(monthCoverageTemplate, monthCoverageSheet, months, rawData);
            weekCoverageSheetService = new TraderMonthlyWeekWeekCoverageSheetExcelService(weekCoverageTemplate, weekCoverageSheet, year, weeks, rawData);
        }

        public MemoryStream ExportExcel()
        {
            mainSheetService.Build();
            monthCoverageSheetService.Build();
            weekCoverageSheetService.Build();

            DeleteTemplateSheet();
            return ToMemoryStream();
        }

        private MemoryStream ToMemoryStream()
        {
            var memoryStream = new MemoryStream();
            excelPackage.SaveAs(memoryStream);
            memoryStream.Position = 0;
            excelPackage.Dispose();

            return memoryStream;
        }

        private void DeleteTemplateSheet()
        {
            excelPackage.Workbook.Worksheets.Delete("Sheet1");
            excelPackage.Workbook.Worksheets.Delete("Sheet2");
            excelPackage.Workbook.Worksheets.Delete("Sheet3");
        }

        public void Dispose()
        {
            excelPackage?.Dispose();
        }
    }
}