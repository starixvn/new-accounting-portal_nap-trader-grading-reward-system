using System;

namespace Fanex.NAP.TGRS.Reports.Services.Implements
{
    using Fanex.NAP.TGRS.Reports.Models.TraderPerformanceMonthly;
    using OfficeOpenXml;
    using System.Collections.Generic;
    using System.Linq;

    public class TraderMonthlyWeekMonthCoverageSheetExcelService
    {
        private readonly ExcelWorksheet template;
        private readonly ExcelWorksheet sheet;
        private readonly List<int> months;
        private readonly List<TraderPerformanceWeekRawData> rawData;
        private int rowIndex = 3;

        public TraderMonthlyWeekMonthCoverageSheetExcelService(
            ExcelWorksheet template,
            ExcelWorksheet sheet,
            List<int> months,
            List<TraderPerformanceWeekRawData> rawData)
        {

            this.template = template;
            this.sheet = sheet;

            this.months = months;
            this.rawData = rawData;
        }

        public void Build()
        {
            foreach (var month in months)
            {
                template.Cells[3, 1, 3, 7].Copy(sheet.Cells[rowIndex, 1, rowIndex, 7]);
                var monthName = new DateTime(2000, month, 1).ToString("MMMM");
                sheet.Cells[rowIndex, 1].Value = monthName;

                var rawDataForMonth = rawData.Where(x => x.EventDate.Month == month).ToList();
                if (rawDataForMonth.Count == 0)
                {
                    AssignEmptyCell(rowIndex, 2, 7);
                }
                else
                {
                    AssignMonthStatistic(rawDataForMonth);
                }

                rowIndex++;
            }
        }

        private void AssignMonthStatistic(List<TraderPerformanceWeekRawData> rawDataForMonth)
        {
            var cphMatchCount = rawDataForMonth.Where(x => x.Department == "CPH").Sum(x => x.MatchCount);
            var sphMatchCount = rawDataForMonth.Where(x => x.Department == "SPH").Sum(x => x.MatchCount);
            var lgMatchCount = rawDataForMonth.Where(x => x.Department == "LG").Sum(x => x.MatchCount);
            var totalMatchCount = cphMatchCount + sphMatchCount + lgMatchCount;

            sheet.Cells[rowIndex, 2].Value = cphMatchCount;
            sheet.Cells[rowIndex, 3].Value = sphMatchCount;
            sheet.Cells[rowIndex, 4].Value = lgMatchCount;
            sheet.Cells[rowIndex, 5].Value = totalMatchCount;
            sheet.Cells[rowIndex, 6].Value = ((decimal)cphMatchCount + (decimal)sphMatchCount) / totalMatchCount;
            sheet.Cells[rowIndex, 7].Value = (decimal)lgMatchCount / totalMatchCount;
        }

        private void AssignEmptyCell(int row, int columnFrom, int columnTo)
        {
            for (var i = columnFrom; i <= columnTo; i++)
            {
                sheet.Cells[row, i].Value = "-";
            }
        }
    }
}