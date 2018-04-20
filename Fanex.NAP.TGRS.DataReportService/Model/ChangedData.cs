namespace Fanex.NAP.TGRS.DataReportService.Model
{
    using System.Collections.Generic;
    using System.Linq;

    public abstract class ChangedData
    {
        public IDictionary<int, string> Bettypes { get; set; }

        public string JoinedBettypes
        {
            get
            {
                var prioritized_bettype = new HashSet<int> { 1, 3, 7, 8, 5, 15 };
                var sorted = Bettypes.OrderBy(kv => !prioritized_bettype.Contains(kv.Key) ? 99 : kv.Key == 5 ? 10 : kv.Key).Select(kv => kv.Value);

                if (sorted.Count() <= 3)
                {
                    return string.Join(", ", sorted);
                }

                return string.Join(", ", sorted.Take(3)) + "...";
            }
        }
        
        public double? OldTurnover { get; set; }

        public double? OldWinLoss { get; set; }

        public double? OldBetCount { get; set; }

        public double? NewTurnover { get; set; }

        public double? NewWinLoss { get; set; }

        public double? NewBetCount { get; set; }

        protected bool Equal(ChangedData data)
        {
            return OldTurnover == data.OldTurnover
                && OldWinLoss == data.OldWinLoss
                && OldBetCount == data.OldBetCount
                && NewBetCount == data.NewBetCount
                && NewTurnover == data.NewTurnover
                && NewWinLoss == data.NewWinLoss;
        }
    }
}