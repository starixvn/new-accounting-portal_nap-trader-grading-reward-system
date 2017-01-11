namespace Fanex.NAP.TGRS.Reports.Models.NewPerformanceDetail
{
    using System;

    [Serializable]
    public class LeaguePerformanceInfo
    {
        public int LeagueId { get; set; }

        public string LeagueName { get; set; }

        public int TraderCount { get; set; }

        public int MatchCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal Juice { get; set; }

        public int BetCount { get; set; }

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