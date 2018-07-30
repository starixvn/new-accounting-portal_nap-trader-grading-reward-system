namespace Fanex.NAP.TGRS.Reports.Models.BettypeMonthlyPerformance
{
    using System.Collections.Generic;
    using System.Configuration;
    using System.Linq;

    public class SummaryList
    {
        public SummaryList(IEnumerable<BettypeMonthlySummary> data)
        {
            Data = OrderBettype(data);
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

        private IEnumerable<BettypeMonthlySummary> OrderBettype(IEnumerable<BettypeMonthlySummary> data)
        {
            var orderList = ConfigurationManager.AppSettings["BettypeOrder"].Split(',').Select(int.Parse).ToList();

            return data
                .OrderBy(bt =>
                {
                    var index = orderList.FindIndex(i => i == bt.BettypeId);

                    return index == -1 ? 99 : index;
                })
                .ThenBy(bt => bt.BettypeName);
        }
    }
}