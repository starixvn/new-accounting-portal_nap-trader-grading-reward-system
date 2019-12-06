namespace Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance
{
    /// <summary>
    /// Trader performance model.
    /// </summary>
    public class TraderPerformanceInfo
    {
        public int CustId { get; set; }

        public byte MatchCount { get; set; }

        public int MultipleTimes { get; set; }

        public int FrequencyCust { get; set; }
    }
}