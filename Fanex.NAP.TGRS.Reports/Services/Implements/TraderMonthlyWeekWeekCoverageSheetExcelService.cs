namespace Fanex.NAP.TGRS.Reports.Services.Implements
{
    using Fanex.NAP.TGRS.Reports.Models.TraderPerformanceMonthly;
    using OfficeOpenXml;
    using System.Collections.Generic;
    using System.Linq;

    public class TraderMonthlyWeekWeekCoverageSheetExcelService
    {
        private readonly ExcelWorksheet template;
        private readonly ExcelWorksheet sheet;
        private readonly int year;
        private readonly List<int> weeks;
        private readonly List<TraderPerformanceWeekRawData> rawData;
        private int rowIndex = 3;

        public TraderMonthlyWeekWeekCoverageSheetExcelService(
            ExcelWorksheet template,
            ExcelWorksheet sheet,
            int year,
            List<int> weeks,
            List<TraderPerformanceWeekRawData> rawData)
        {

            this.template = template;
            this.sheet = sheet;
            this.year = year;
            this.weeks = weeks;
            this.rawData = rawData;
        }

        public void Build()
        {
            foreach (var week in weeks)
            {
                // Copy Week header
                BuildWeekHeader(week);

                // Week body
                BuildWeekBody(week);
            }
        }

        private void BuildWeekHeader(int week)
        {
            var datesOfWeek = CalendarHelper.GetWeekDatesOfYear(year, week);
            var rawDataForWeek = rawData.Where(x => datesOfWeek.Contains(x.EventDate)).ToList();

            template.Cells[3, 1, 3, 7].Copy(sheet.Cells[rowIndex, 1, rowIndex, 7]);
            sheet.Cells[rowIndex, 1].Value = $"Week {week}";
            if (rawDataForWeek.Count == 0)
            {
                AssignEmptyCell(rowIndex, 2, 7);
            }
            else
            {
                AssignDayStatistic(rawDataForWeek);
            }

            rowIndex++;
        }

        private void BuildWeekBody(int week)
        {
            var datesOfWeek = CalendarHelper.GetWeekDatesOfYear(year, week);
            foreach (var date in datesOfWeek)
            {
                var rawDataForDate = rawData.Where(x => x.EventDate == date).ToList();

                template.Cells[4, 1, 4, 7].Copy(sheet.Cells[rowIndex, 1, rowIndex, 7]);
                sheet.Cells[rowIndex, 1].Value = date;
                
                if (rawDataForDate.Count == 0)
                {
                    AssignEmptyCell(rowIndex, 2, 7);
                }
                else
                {
                    AssignDayStatistic(rawDataForDate);
                }

                rowIndex++;
            }
        }

        private void AssignDayStatistic(List<TraderPerformanceWeekRawData> data)
        {
            var cphMatchCount = data.Where(x => x.Department == "CPH").Sum(x => x.MatchCount);
            var sphMatchCount = data.Where(x => x.Department == "SPH").Sum(x => x.MatchCount);
            var lgMatchCount = data.Where(x => x.Department == "LG").Sum(x => x.MatchCount);
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