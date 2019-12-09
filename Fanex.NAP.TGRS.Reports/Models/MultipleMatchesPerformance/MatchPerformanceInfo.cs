namespace Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance
{
    using System;

    public class MatchPerformanceInfo
    {
        public string MatchGroupKey { get; set; }

        public int? MatchId { get; set; }

        public int? HomeId { get; set; }

        public int? AwayId { get; set; }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }

        public DateTime? EventDate { get; set; }

        public decimal? Turnover { get; set; }

        public decimal? WinLoss { get; set; }

        public int? BetCount { get; set; }

        public decimal? Margin { get; set; }
    }
}