namespace Fanex.NAP.TGRS.Reports.Models.NewPerformanceDetail
{
    public class BetTypeTraderPerformanceInfo
    {
        public int CustId { get; set; }

        public string TraderName { get; set; }

        public byte? Grade { get; set; }

        public string TeamName { get; set; }

        public int MatchCount { get; set; }

        public int LeagueCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal Juice { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal? Score { get; set; }

        public decimal Leftover
        {
            get
            {
                return WinLoss - Juice;
            }
        }

        public decimal? JuiceMargin
        {
            get
            {
                return Turnover != 0 ? ((decimal?)(Juice / Turnover * 100)) : null;
            }
        }

        public decimal? LeftoverMargin
        {
            get
            {
                return Margin - JuiceMargin;
            }
        }

        public decimal? Margin
        {
            get
            {
                return Turnover != 0 ? ((decimal?)(WinLoss / Turnover * 100)) : null;
            }
        }
    }
}