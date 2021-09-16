namespace Fanex.NAP.TGRS.Reports.Models.PerformanceDetail
{
    public class IntervalBetChoicePerformanceInfo
    {
        public string Interval { get; set; }

        public string BetChoice { get; set; }

        public int LeagueCount { get; set; }

        public int MatchCount { get; set; }

        public int BetCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal? Margin
        {
            get
            {
                return Turnover != 0 ? ((decimal?)(WinLoss / Turnover * 100)) : null;
            }
        }

        public decimal TurnoverReal { get; set; }

        public decimal WinLossReal { get; set; }

        public decimal? MarginReal
        {
            get
            {
                return TurnoverReal != 0 ? ((decimal?)(WinLossReal / TurnoverReal * 100)) : null;
            }
        }

        public bool IsLive { get; set; }
    }
}
