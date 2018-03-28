namespace Fanex.NAP.TGRS.Reports.Services.Implements
{
    using Fanex.Data;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Reports.Criteria.TraderPerformanceMonthly;
    using Fanex.NAP.TGRS.Reports.Models.TraderPerformanceMonthly;
    using Fanex.NAP.TGRS.Reports.Services.Interfaces;
    using Newtonsoft.Json.Linq;
    using NPOI.SS.UserModel;
    using NPOI.XSSF.UserModel;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;

    internal class TraderMonthlyReportService : TGRSBaseService, ITraderMonthlyReport
    {
        public SummaryList GetReports(GetTraderPerformanceMonthlyCriteria filter)
        {
            using (var db = new ObjectDb(filter.GetSettingKey()))
            {
                using (var multi = db.QueryMultiple(filter))
                {
                    var traders = multi.Read<Trader>();
                    if (traders != null && traders.Count() > 0)
                    {
                        traders = traders.OrderBy(t => t.ShiftOrder);
                    }


                    if (filter.Bettype != (int)Bettype.All)
                    {
                        var bettype = ((Bettype)filter.Bettype).GetString();

                        foreach (var trader in traders)
                        {
                            if (trader.Product != null && trader.Product.Contains(bettype)) trader.Product = filter.Bettype.ToString();
                            else trader.Product = null;
                        }
                    }

                    var fstHalves = multi.Read<AvgSummary>();
                    var sndHalves = multi.Read<AvgSummary>();

                    var years = multi.Read<YearSummary>();
                    var months = multi.Read<MonthSummary>();

                    return new SummaryList(traders, fstHalves, sndHalves, years, months, filter.Year);
                }
            }
        }

        public Stream ExportExcel(string template, GetTraderPerformanceMonthlyCriteria filter)
        {
            var wb = new XSSFWorkbook(File.OpenRead(template));
            var sheet = wb.GetSheetAt(0);

            WriteHeader(sheet, filter);

            var data = GetReports(filter);

            var rowIdx = 2;
            var noIdx = 1;

            foreach (var shiftGroup in data.Data)
            {
                WriteRow(sheet, rowIdx, -1, shiftGroup.Shift);
                rowIdx++;

                foreach (var trader in shiftGroup.Data)
                {
                    WriteRow(sheet, rowIdx, noIdx, trader);

                    rowIdx++;
                    noIdx++;
                }
            }

            WriteTotal(sheet, data.Total);

            sheet.RemoveRow(sheet.GetRow(rowIdx));
            sheet.RemoveRow(sheet.GetRow(rowIdx + 1));
            sheet.ShiftRows(sheet.LastRowNum - 1, sheet.LastRowNum, -2);

            var stream = new MemoryStream();
            wb.Write(stream);
            stream.Position = 0;

            return stream;
        }

        public IEnumerable<Shift> GetShifts()
        {
            return GetData<Shift>(new GetAllShiftCriteria());
        }

        private void WriteHeader(ISheet sheet, GetTraderPerformanceMonthlyCriteria filter)
        {
            var row = sheet.GetRow(0);

            var month = 1;
            var year = filter.Year;

            foreach (var cell in row.Cells.Where(c => c.CellType != CellType.Blank))
            {
                if (cell.CellType == CellType.Numeric)
                {
                    cell.SetCellValue(new DateTime(year, month, 1));
                    month++;
                }
                else
                {
                    var value =
                            cell.StringCellValue
                            .Replace("{this year}", year.ToString())
                            .Replace("{last year}", (year - 1).ToString());

                    cell.SetCellValue(value);
                }
            }
        }

        private void WriteRow(ISheet sheet, int rowIdx, int noIdx, SummaryItem item)
        {
            sheet.ShiftRows(rowIdx, sheet.LastRowNum, 1, true, false);
            var row = sheet.CreateRow(rowIdx);

            CopyStyle(sheet.GetRow(noIdx < 0 ? rowIdx + 2 : rowIdx + 1), row);

            row.GetCell(0).SetCellValue(noIdx < 0 ? item.Trader.ShiftName : noIdx.ToString());
            var offset = 1;

            //trader
            if (noIdx > 0) WriteObject(row, offset, item.Trader, Trader.Columns);
            offset += Trader.Columns.Count;

            //fst half
            WriteObject(row, offset, item.FstHalf, AvgSummary.Columns);
            offset += AvgSummary.Columns.Count;

            //snd half
            WriteObject(row, offset, item.SndHalf, AvgSummary.Columns);
            offset += AvgSummary.Columns.Count;

            //this year
            WriteObject(row, offset, item.CurrentYear, AvgSummary.Columns);
            offset += AvgSummary.Columns.Count;

            //last year
            WriteObject(row, offset, item.LastYear, AvgSummary.Columns);
            offset += AvgSummary.Columns.Count;

            for (int i = 0; i < 12; i++)
            {
                if (item.Months.ContainsKey(i + 1)) WriteObject(row, offset, item.Months[i + 1], Summary.Columns);
                else WriteObject(row, offset, null, Summary.Columns);
                offset += Summary.Columns.Count;
            }
        }

        private void WriteTotal(ISheet sheet, SummaryItem total)
        {
            var row = sheet.GetRow(sheet.LastRowNum);

            var offset = 1 + Trader.Columns.Count;

            //fst half
            WriteObject(row, offset, total.FstHalf, AvgSummary.Columns);
            offset += AvgSummary.Columns.Count;

            //snd half
            WriteObject(row, offset, total.SndHalf, AvgSummary.Columns);
            offset += AvgSummary.Columns.Count;

            //this year
            WriteObject(row, offset, total.CurrentYear, AvgSummary.Columns);
            offset += AvgSummary.Columns.Count;

            //last year
            WriteObject(row, offset, total.LastYear, AvgSummary.Columns);
            offset += AvgSummary.Columns.Count;

            for (int i = 0; i < 12; i++)
            {
                if (total.Months.ContainsKey(i + 1)) WriteObject(row, offset, total.Months[i + 1], Summary.Columns);
                else WriteObject(row, offset, null, Summary.Columns);
                offset += Summary.Columns.Count;
            }
        }

        private void WriteObject(IRow row, int offset, object obj, JObject columns)
        {
            var json = obj == null ? new JObject() : JObject.FromObject(obj);
            var i = 0;

            foreach (var pair in columns)
            {
                var jtoken = json[pair.Value.Value<string>()];
                var cell = row.GetCell(i + offset);

                if (jtoken == null) cell.SetCellValue("");
                else if (jtoken.Type == JTokenType.Integer) cell.SetCellValue(jtoken.Value<int>());
                else if (jtoken.Type == JTokenType.Float)
                {
                    var value = jtoken.Value<double>();

                    if (pair.Key.Contains("Margin")) cell.SetCellValue(value);
                    else cell.SetCellValue(value);
                }
                else
                {
                    var value = jtoken.Value<string>();
                    cell.SetCellValue(value ?? "");
                }

                i++;
            }
        }

        private void CopyStyle(IRow source, IRow target)
        {
            foreach (var cell in source.Cells)
            {
                var newCell = target.GetCell(cell.ColumnIndex) ?? target.CreateCell(cell.ColumnIndex);

                newCell.CellStyle = cell.CellStyle;
                newCell.SetCellType(cell.CellType);
            }
        }
    }
}