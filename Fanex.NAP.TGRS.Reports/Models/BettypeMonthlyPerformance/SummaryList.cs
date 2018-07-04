namespace Fanex.NAP.TGRS.Reports.Models.BettypeMonthlyPerformance
{
    using System.Collections.Generic;
    using System.Linq;

    public class SummaryList
    {
        public SummaryList(IEnumerable<BettypeMonthlySummary> data)
        {
            var positiveBettype = data.Where(d => d.BettypeId >= 0).OrderBy(d => d.BettypeId);
            var negativeBettype = data.Where(d => d.BettypeId < 0).OrderBy(d => -d.BettypeId);

            Data = positiveBettype.Concat(negativeBettype);
        }

        public IEnumerable<BettypeMonthlySummary> Data { get; }

        public BettypeMonthlySummary Total
        {
            get
            {
                var result = new BettypeMonthlySummary();

                result.FstHalf = Data.Select(d => d.FstHalf).Aggregate<Summary, Summary>(null, (acc, s) => acc + s);
                result.SndHalf = Data.Select(d => d.SndHalf).Aggregate<Summary, Summary>(null, (acc, s) => acc + s);
                result.FullYear = Data.Select(d => d.FullYear).Aggregate<Summary, Summary>(null, (acc, s) => acc + s);
                result.Months = new Dictionary<string, Summary>(12);

                for (int i = 0; i < 12; i++)
                {
                    var key = $"{i + 1}";
                    var value =
                        Data
                        .Select(d => d.Months.ContainsKey(key) ? d.Months[key] : null)
                        .Aggregate<Summary, Summary>(null, (acc, s) => acc + s);

                    result.Months.Add(key, value);
                }

                return result;
            }
        }
    }
}