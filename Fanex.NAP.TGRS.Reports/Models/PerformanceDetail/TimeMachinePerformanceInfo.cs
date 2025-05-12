namespace Fanex.NAP.TGRS.Reports.Models.PerformanceDetail
{
    public class TimeMachinePerformanceInfo
    {
        public decimal HDP1 { get; set; }

        public int LeagueCount { get; set; }

        public int MatchCount { get; set; }

        public int BetCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal? Margin { get; set; }

        public decimal TurnoverReal { get; set; }

        public decimal WinLossReal { get; set; }

        public decimal? MarginReal { get; set; }
    }
}
