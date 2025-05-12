using System;

namespace Fanex.NAP.TGRS.Reports.Services.Implements
{
    using Fanex.NAP.TGRS.Reports.Models.TraderPerformanceMonthly;
    using OfficeOpenXml;
    using System.Collections.Generic;
    using System.Linq;
    using System.Windows.Documents;

    public class TraderMonthlyWeekMainSheetExcelService
    {
        private readonly ExcelWorksheet template;
        private readonly ExcelWorksheet sheet;
        private readonly int year;
        private readonly List<int> months;
        private readonly List<TraderPerformanceWeekRawData> rawData;
        private int rowIndex = 3;
        private int numberIndex = 1;

        public TraderMonthlyWeekMainSheetExcelService(
            ExcelWorksheet template,
            ExcelWorksheet sheet,
            int year,
            List<int> months,
            List<TraderPerformanceWeekRawData> rawData)
        {

            this.template = template;
            this.sheet = sheet;

            this.year = year;
            this.months = months;
            this.rawData = rawData;
        }

        public void Build()
        {
            CreateMainSheetHeader();
            CreateMainSheetBody();
            BuildTotalRow();
        }

        private void CreateMainSheetHeader()
        {
            var monthCount = months.Count;

            var startPasteColumn = 7; // Column G

            for (var i = 0; i < monthCount; i++)
            {
                // Calculate paste position (shift 5 columns each time)
                var currentColumn = startPasteColumn + (i * 5) + 1;

                // Create destination range (same number of rows and columns)
                var destRange = sheet.Cells[
                    1, currentColumn,         // Start row, start column
                    2, currentColumn + 4];     // End row, end column (H:L = 5 columns)

                template.Cells["H1:L2"].Copy(destRange);

                var currentMonth = new DateTime(year, months[i], 1);
                sheet.Cells[1, currentColumn].Value = currentMonth.ToString("MMMM - yyyy");
            }
        }

        private void CreateMainSheetBody()
        {
            for (var i = 1; i <= 6; i++)
            {
                CreateMainSheetBodyWeek(i);
            }
        }

        private void CreateMainSheetBodyWeek(int week)
        {
            var columnCount = 7 + months.Count * 5;

            // Copy Week header
            template.Cells[3, 1, 3, 7].Copy(sheet.Cells[rowIndex, 1, rowIndex, 7]);
            for (var i = 0; i < months.Count; i++)
            {
                template.Cells[3, 8, 3, 12].Copy(sheet.Cells[rowIndex, 8 + 5 * i, rowIndex, 12 + 5 * i]);
            }

            sheet.Cells[rowIndex, 1, rowIndex, columnCount].Merge = true;
            sheet.Cells[rowIndex, 1].Value = $"Week {week}";

            // Week body
            var weekDates = CalendarHelper.GetWeekDates(year, week);
            var weekData = rawData.Where(x => weekDates.Contains(x.EventDate)).ToList();
            var rowGroups = weekData.GroupBy(x => new { x.TraderName, x.LeagueName, x.Grade, x.TeamName, x.Department});
            rowIndex++;

            foreach (var row in rowGroups)
            {
                var key = row.Key;
                var rowData = row.ToList();

                var trader = key.TraderName;
                var grade = key.Grade;
                var teamName = key.TeamName;
                var department = key.Department;
                var league = key.LeagueName;

                BuildWeekTitle(trader, grade, teamName, department, league);
                BuildWeekStatistic(week, rowData, trader, teamName, grade, department, league);

                numberIndex++;
                rowIndex++;
            }
        }

        private void BuildWeekTitle(string trader, string grade, string teamName, string department, string league)
        {
            template.Cells[4, 1, 4, 7].Copy(sheet.Cells[rowIndex, 1, rowIndex, 7]);
            sheet.Cells[rowIndex, 1].Value = numberIndex;
            sheet.Cells[rowIndex, 2].Value = trader;
            sheet.Cells[rowIndex, 3].Value = grade;
            sheet.Cells[rowIndex, 4].Value = teamName;
            sheet.Cells[rowIndex, 5].Value = department;
            sheet.Cells[rowIndex, 6].Value = year;
            sheet.Cells[rowIndex, 7].Value = league;
        }

        private void BuildWeekStatistic(
            int week,
            List<TraderPerformanceWeekRawData> rowData,
            string trader,
            string teamName,
            string grade,
            string department,
            string league)
        {
            var columnIndex = 7;

            foreach (var month in months)
            {
                var monthDates = CalendarHelper.GetWeekDates(year, month, week);
                var traderDataForMonth = GetTraderDataForMonth(rowData, monthDates, trader, teamName, grade, department, league);

                template.Cells[4, 8, 4, 12].Copy(sheet.Cells[rowIndex, columnIndex + 1, rowIndex, columnIndex + 5]);

                if (traderDataForMonth.Count == 0)
                {
                    AssignEmptyCell(rowIndex, columnIndex + 1, columnIndex + 5);
                }
                else
                {
                    AssignWeekStatisticForMonth(traderDataForMonth, columnIndex);
                }

                columnIndex += 5;
            }
        }

        private void AssignWeekStatisticForMonth(List<TraderPerformanceWeekRawData> data, int columnIndex)
        {
            var turnover = data.Sum(x => x.Turnover);
            var netWinLoss = data.Sum(x => x.NetWinLoss);
            var matchCount = data.Sum(x => x.MatchCount);
            var betCount = data.Sum(x => x.BetCount);

            sheet.Cells[rowIndex, columnIndex + 1].Value = matchCount;
            sheet.Cells[rowIndex, columnIndex + 2].Value = turnover;
            sheet.Cells[rowIndex, columnIndex + 3].Value = netWinLoss;
            sheet.Cells[rowIndex, columnIndex + 5].Value = betCount;
            sheet.Cells[rowIndex, columnIndex + 4].Value = netWinLoss / turnover;
        }

        private void AssignEmptyCell(int row, int columnFrom, int columnTo)
        {
            for (var i = columnFrom; i <= columnTo; i++)
            {
                sheet.Cells[row, i].Value = "-";
            }
        }

        private static List<TraderPerformanceWeekRawData> GetTraderDataForMonth(
            List<TraderPerformanceWeekRawData> rowData,
            List<DateTime> monthDates,
            string trader,
            string teamName,
            string grade,
            string department,
            string league)
        {
            return rowData.Where(x => monthDates.Contains(x.EventDate)
                                      && x.TraderName == trader
                                      && x.TeamName == teamName
                                      && x.Grade == grade
                                      && x.Department == department
                                      && x.LeagueName == league)
                .ToList();
        }

        private void BuildTotalRow()
        {
            template.Cells["A5:G5"].Copy(sheet.Cells[rowIndex, 1, rowIndex, 5]);

            var columnIndex = 7; 
            foreach (var month  in months)
            {
                var destRange = sheet.Cells[
                    rowIndex, columnIndex + 1,
                    rowIndex, columnIndex + 5];

                template.Cells["H5:L5"].Copy(destRange);

                var monthData = rawData.Where(x => x.EventDate.Month == month).ToList();
                if (monthData.Count == 0)
                {
                    AssignEmptyCell(rowIndex, columnIndex + 1, columnIndex + 5);
                }
                else
                {
                    AssignWeekStatisticForMonth(monthData, columnIndex);
                }

                columnIndex += 5;
            }
        }
    }
}