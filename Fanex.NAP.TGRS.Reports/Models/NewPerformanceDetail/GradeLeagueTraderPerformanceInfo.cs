namespace Fanex.NAP.TGRS.Reports.Models.NewPerformanceDetail
{
    public class GradeLeagueTraderPerformanceInfo
    {
        public int CustId { get; set; }

        public string TraderName { get; set; }

        public string TeamName { get; set; }

        public int MatchCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal TurnoverJuice { get; set; }

        public decimal TurnoverLeftover
        {
            get
            {
                return Turnover - TurnoverJuice;
            }
        }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal? Score { get; set; }

        public decimal Juice { get; set; }

        public decimal WinlostLeftover
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
                return TurnoverJuice != 0 ? ((decimal?)(Juice / TurnoverJuice * 100)) : null;
            }
        }

        public decimal? JuiceMarginTotal
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
                return TurnoverLeftover != 0 ? ((decimal?)(WinlostLeftover / TurnoverLeftover * 100)) : null;
            }
        }

        public decimal? LeftoverMarginTotal
        {
            get
            {
                return Turnover != 0 ? ((decimal?)(WinlostLeftover / Turnover * 100)) : null;
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