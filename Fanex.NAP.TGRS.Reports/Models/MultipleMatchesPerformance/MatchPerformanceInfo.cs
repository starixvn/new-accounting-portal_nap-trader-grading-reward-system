namespace Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance
{
    using System;

    public class MatchPerformanceInfo
    {
        public int? MatchId { get; set; }

        public DateTime? EventDate { get; set; }

        public DateTime? GlobalShowTime { get; set; }

        public int? HomeId { get; set; }

        public int? AwayId { get; set; }

        public int MatchGroup { get; set; }

        public string LeagueName { get; set; }

        public decimal? Turnover { get; set; }

        public decimal? WinLoss { get; set; }

        public int? BetCount { get; set; }

        public decimal? Margin { get; set; }       
    }
}