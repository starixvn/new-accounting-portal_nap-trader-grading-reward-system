namespace Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance
{
    public class LeagueOfBettypeBetChoiceInfo
    {
        public int LeagueId { get; set; }

        public string LeagueName { get; set; }

        public int LeagueGroupID { get; set; }

        public bool IsLive { get; set; }

        public int TraderCount { get; set; }

        public int MatchCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal Margin { get; set; }
    }
}
