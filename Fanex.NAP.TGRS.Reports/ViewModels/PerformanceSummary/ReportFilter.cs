namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceSummary
{
    using System;

    public class ReportFilter
    {
        public string Trader { get; set; }

        public int ReportType { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int LeagueId { get; set; }

        public DateTime EventDate { get; set; }

        public int MatchId { get; set; }
    }
}
