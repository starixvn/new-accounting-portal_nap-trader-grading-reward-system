namespace Fanex.NAP.TGRS.Reports.ViewModels.RTModelPerformanceDetail
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using NPOI.SS.UserModel;
    using System;
    using System.Linq;

    [Serializable]
    public class BetTypeExcelConfig : FSExcelConfig<object, BetTypeItem, BetTypeItem>
    {
        protected override int SheetIndex => 0;

        protected override string SheetName => null;      

        protected override void FillData(IRow row, BetTypeItem data)
        {
            var idx = 0;

            row.GetCell(idx++).SetCellValue(data.BetTypeName);          

            //foreach (var item in data.RobotTradingItemList)
            //{
            //    row.GetCell(idx++).SetCellValue(item.Value.Turnover.ToString());
            //    row.GetCell(idx++).SetCellValue(item.Value.WinLoss.ToString());
            //    row.GetCell(idx++).SetCellValue(item.Value.Margin.ToString());
            //}
        }

        protected override void FillLegend(IRow row, object legend)
        {            
        }

    }
}