namespace Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance
{
    public class TraderOfBettypeInfo
    {
        public int TraderId { get; set; }

        public string TraderName { get; set; }

        public int GradeId { get; set; }

        public int TeamId { get; set; }

        public string TeamName { get; set; }

        public int LeagueCount { get; set; }

        public int MatchCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal Margin { get; set; }

        public bool IsLive { get; set; }
    }
}
