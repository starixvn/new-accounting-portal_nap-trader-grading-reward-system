namespace Fanex.NAP.TGRS.Reports.Models.PerformanceDetail
{
    public class LeaguePerformanceInfo2
    {
        public int? LeagueId { get; set; }

        public string LeagueName { get; set; }

        public int? LeagueGroupID { get; set; }

        public decimal? LeagueBenchmark { get; set; }

        public decimal? BetTypeBMShift1 { get; set; }

        public decimal? BetTypeBMShift2 { get; set; }

        public decimal? BetTypeBMShift3 { get; set; }

        public int? TraderCount { get; set; }

        public int? MatchCount { get; set; }

        public int? BetChoiceCount { get; set; }

        public decimal? Turnover { get; set; }

        public decimal? WinLoss { get; set; }

        public decimal? Margin { get; set; }

        public decimal? TurnoverReal { get; set; }

        public decimal? WinLossReal { get; set; }

        public decimal? MarginReal { get; set; }

        public int? BetCount { get; set; }

        public Market Market { get; set; }

        public bool IsLive { get; set; }

        public int FlagForViewReport { get; set; }
    }
}
