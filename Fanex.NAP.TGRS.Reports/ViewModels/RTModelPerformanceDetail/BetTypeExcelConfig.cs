namespace Fanex.NAP.TGRS.Reports.ViewModels.RTModelPerformanceDetail
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using NPOI.SS.UserModel;
    using System;

    [Serializable]
    public class BetTypeExcelConfig : FSExcelConfig<object, BetTypeItem, BetTypeItem>
    {
        protected override int SheetIndex => 0;

        protected override string SheetName => null;

        protected override void FillData(IRow row, BetTypeItem data)
        {
            
        }

        protected override void FillLegend(IRow row, object legend)
        {
            
        }
    }
}