namespace Fanex.NAP.TGRS.Reports.Models.TraderPerformanceMonthly
{
    using System.Collections.Generic;
    using System.Linq;

    public class ShiftGroup
    {
        public ShiftGroup(string shiftName, IEnumerable<SummaryItem> shiftGroup)
        {
            var shift = shiftGroup.Aggregate(new SummaryItem(), (acc, s) => acc + s);
            shift.Trader = new Trader { ShiftName = shiftName };
            Shift = shift;

            Data = shiftGroup.OrderBy(s => s.Trader.Grade).ThenBy(s => s.Trader.TraderName);
        }

        public SummaryItem Shift { get; }

        public IEnumerable<SummaryItem> Data { get; }
    }
}