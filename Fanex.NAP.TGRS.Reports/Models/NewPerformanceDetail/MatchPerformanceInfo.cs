namespace Fanex.NAP.TGRS.Reports.Models.NewPerformanceDetail
{
    using System;

    public class MatchPerformanceInfo
    {
        public int? LeagueId { get; set; }

        public int? MatchId { get; set; }

        public int? HomeId { get; set; }

        public int? AwayId { get; set; }

        public DateTime? EventDate { get; set; }

        public decimal? Turnover { get; set; }

        public decimal? Juice { get; set; }

        public decimal? WinLoss { get; set; }

        public int? BetCount { get; set; }

        public decimal? Margin { get; set; }

        public decimal? Score { get; set; }

        public decimal? Leftover
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
    }
}