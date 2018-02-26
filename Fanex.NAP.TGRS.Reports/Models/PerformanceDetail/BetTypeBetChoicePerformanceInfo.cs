namespace Fanex.NAP.TGRS.Reports.Models.PerformanceDetail
{
    public class BetTypeBetChoicePerformanceInfo
    {
        public string BetChoice { get; set; }

        public int LeagueCount { get; set; }

        public int MatchCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal? Margin
        {
            get
            {
                return Turnover != 0 ? ((decimal?)(WinLoss / Turnover * 100)) : null;
            }
        }
    }
}