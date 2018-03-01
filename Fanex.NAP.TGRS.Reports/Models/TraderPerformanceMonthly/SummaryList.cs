using System.Collections.Generic;
using System.Linq;

namespace Fanex.NAP.TGRS.Reports.Models.TraderPerformanceMonthly
{
    public class SummaryList
    {
        public SummaryList(IEnumerable<Trader> traders, IEnumerable<AvgSummary> fstHalf, IEnumerable<AvgSummary> sndHalf, IEnumerable<YearSummary> years, IEnumerable<MonthSummary> months, int reportYear)
        {
            var joined =
                traders
                    .GroupJoin(fstHalf, tr => tr.TraderId, fst => fst.TraderId, (tr, fst) => new SummaryItem { Trader = tr, FstHalf = fst.FirstOrDefault() })
                    .GroupJoin(sndHalf, s => s.Trader.TraderId, snd => snd.TraderId, (s, snd) => { s.SndHalf = snd.FirstOrDefault(); return s; })
                    .GroupJoin(years, s => s.Trader.TraderId, y => y.TraderId, (s, y) => s.WithYears(y, reportYear))
                    .GroupJoin(months, s => s.Trader.TraderId, m => m.TraderId, (s, ms) => s.WithMonths(ms));

            var final = new Queue<ShiftGroup>();

            foreach (var shiftGroup in joined.GroupBy(s => s.Trader.ShiftName))
            {
                var shift = new ShiftGroup(shiftGroup.Key, shiftGroup);
                final.Enqueue(shift);
            }

            Data = final;
            Total = joined.Aggregate(new SummaryItem(), (acc, s) => acc + s);
        }

        public IEnumerable<ShiftGroup> Data { get; set; }

        public SummaryItem Total { get; set; }
    }
}