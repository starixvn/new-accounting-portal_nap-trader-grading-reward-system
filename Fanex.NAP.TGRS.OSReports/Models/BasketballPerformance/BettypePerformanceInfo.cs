namespace Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance
{
    public class BettypePerformanceInfo
    {
        public short? BetType { get; set; }

        public string BettypeName { get; set; }

        public int TraderCount { get; set; }

        public int LeagueCount { get; set; }

        public int MatchCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal Margin { get; set; }

        public bool IsLive { get; set; }
    }
}
