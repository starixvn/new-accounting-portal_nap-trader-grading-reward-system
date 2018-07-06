namespace Fanex.NAP.TGRS.Reports.Models.BettypeMonthlyPerformance
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using NPOI.SS.UserModel;
    using System.Collections.Generic;
    using System.Linq;

    public class BettypeMonthlyExcelConfig : FSExcelConfig<object, BettypeMonthlySummary, BettypeMonthlySummary>
    {
        private readonly HashSet<int> _showedColumns;

        private readonly int _year;

        protected override bool HasSummary => true;

        public BettypeMonthlyExcelConfig(int[] showedColumns, int year)
        {
            _showedColumns = new HashSet<int>(showedColumns);

            _year = year;
        }

        protected override int SheetIndex => 0;

        protected override string SheetName => null;

        protected override void ModifyHeader(IRow row)
        {
            var header = row.Sheet.GetRow(0);

            var yearCell = header.GetCell(11);

            yearCell.SetCellValue(string.Format(yearCell.StringCellValue, _year));

            for (int i = 0; i < 12; i++)
            {
                var monthCell = header.GetCell(16 + i * 5);

                monthCell.SetCellValue(string.Format(monthCell.StringCellValue, _year));
            }

            FilterHeader(header);
            FilterRow(row.Sheet.GetRow(1));
        }

        protected override void FillData(IRow row, BettypeMonthlySummary data)
        {
            var idx = 0;

            row.GetCell(idx++).SetCellValue(data.BettypeName);

            idx = FillSummary(row, idx, data.FstHalf);
            idx = FillSummary(row, idx, data.SndHalf);
            idx = FillSummary(row, idx, data.FullYear);

            for (int i = 0; i < 12; i++)
            {
                var key = $"{i + 1}";

                if (data.Months.ContainsKey(key))
                {
                    idx = FillSummary(row, idx, data.Months[key]);
                }
                else
                {
                    idx = FillSummary(row, idx, null);
                }
            }

            FilterRow(row);
        }

        protected override void FillLegend(IRow row, object legend)
        {
        }

        protected override void FillSummary(IRow row, BettypeMonthlySummary summary)
        {
            var idx = 1;

            idx = FillSummary(row, idx, summary.FstHalf);
            idx = FillSummary(row, idx, summary.SndHalf);
            idx = FillSummary(row, idx, summary.FullYear);

            for (int i = 0; i < 12; i++)
            {
                var key = $"{i + 1}";

                if (summary.Months.ContainsKey(key))
                {
                    idx = FillSummary(row, idx, summary.Months[key]);
                }
                else
                {
                    idx = FillSummary(row, idx, null);
                }
            }

            FilterRow(row);
        }

        protected override IRow GetTemplateRow(ISheet sheet, BettypeMonthlySummary data)
        {
            return sheet.GetRow(sheet.LastRowNum - 1);
        }

        protected override void CleanupTemplate(ISheet sheet)
        {
            sheet.ShiftRows(sheet.LastRowNum, sheet.LastRowNum, -1, true, false);
        }

        protected override int ShiftTemplate(ISheet sheet)
        {
            var start = sheet.GetRow(sheet.LastRowNum - 1);
            var end = sheet.GetRow(sheet.LastRowNum);

            sheet.ShiftRows(start.RowNum, end.RowNum, 1, true, false);

            return sheet.LastRowNum - 2;
        }

        private int FillSummary(IRow row, int offset, Summary data)
        {
            var idx = offset;

            if (data == null)
            {
                row.GetCell(idx++).SetCellValue("-");
                row.GetCell(idx++).SetCellValue("-");
                row.GetCell(idx++).SetCellValue("-");
                row.GetCell(idx++).SetCellValue("-");
                row.GetCell(idx++).SetCellValue("-");
            }
            else
            {
                row.GetCell(idx++).SetCellValue(data.MatchCount);
                row.GetCell(idx++).SetCellValue(data.Turnover);
                row.GetCell(idx++).SetCellValue(data.Winloss);
                row.GetCell(idx++).SetCellValue(data.Margin);
                row.GetCell(idx++).SetCellValue(data.BetCount);
            }

            return idx;
        }

        private void FilterHeader(IRow header)
        {
            ClearColumns(header);

            var columns = Enumerable.Range(0, 12 + 3).ToDictionary(a => a * 5 + 1, a => header.GetCell(a * 5 + 1));

            DefractHeader(header, columns, 1);
        }

        private void DefractHeader(IRow header, Dictionary<int, ICell> dict, int column)
        {
            if (column <= 71)
            {
                var cell = dict[column];

                if (cell == null)
                {
                    for (int i = column + 5; i <= 71; i += 5)
                    {
                        var replaceCell = dict[i];

                        if (replaceCell != null)
                        {
                            header.CopyCell(replaceCell.ColumnIndex, column);
                            header.RemoveCell(replaceCell);

                            dict[i] = null;
                            dict[column] = replaceCell;

                            break;
                        }
                    }
                }

                DefractHeader(header, dict, column + 5);
            }
        }

        private void FilterRow(IRow row)
        {
            ClearColumns(row);

            var columns = Enumerable.Range(0, 12 + 3).ToDictionary(a => a * 5 + 1, a => row.GetCell(a * 5 + 1));

            DefractRow(row, columns, 1);
        }

        private void DefractRow(IRow row, Dictionary<int, ICell> dict, int column)
        {
            if (column <= 71)
            {
                var cell = dict[column];

                if (cell == null)
                {
                    for (int i = column + 5; i <= 71; i += 5)
                    {
                        var replaceCell = dict[i];

                        if (replaceCell != null)
                        {
                            for (int j = 0; j < 5; j++)
                            {
                                replaceCell = row.GetCell(i + j);
                                row.CopyCell(replaceCell.ColumnIndex, column + j);
                                row.RemoveCell(replaceCell);
                            }

                            dict[i] = null;
                            dict[column] = replaceCell;

                            break;
                        }
                    }
                }

                DefractRow(row, dict, column + 5);
            }
        }

        private void ClearColumns(IRow row)
        {
            foreach (var cell in row.Cells)
            {
                var pointer = (cell.ColumnIndex - 1) / 5 * 5 + 1;

                if (!_showedColumns.Contains(pointer) && cell.ColumnIndex > 0)
                {
                    var idx = cell.ColumnIndex;
                    row.RemoveCell(cell);
                }
            }
        }
    }
}