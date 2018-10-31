namespace Fanex.NAP.TGRS.OSReports.Models.TraderPerformance
{
    public class MatchBettype
    {
        public string BettypeName { get; set; }

        public decimal Turnover { get; set; }

        public decimal VWinloss { get; set; }

        public decimal Margin => Turnover == 0 ? 0 : VWinloss * 100 / Turnover;

        public int BetCount { get; set; }
    }
}