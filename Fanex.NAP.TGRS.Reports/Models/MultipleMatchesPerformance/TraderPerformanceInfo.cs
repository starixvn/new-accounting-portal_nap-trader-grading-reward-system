namespace Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance
{
    /// <summary>
    /// Trader performance model.
    /// </summary>
    public class TraderPerformanceInfo
    {
        public int CustId { get; set; }

        public string Username { get; set; }

        public byte Grade { get; set; }

        public string TeamName { get; set; }        

        public byte MultipleMatches { get; set; }

        public int MultipleTimes { get; set; }

        public string MatchList { get; set; }

        public decimal? Turnover { get; set; }

        public decimal? Winloss { get; set; }

        public int BetCount { get; set; }

        public decimal? Margin { get; set; }
    }
}