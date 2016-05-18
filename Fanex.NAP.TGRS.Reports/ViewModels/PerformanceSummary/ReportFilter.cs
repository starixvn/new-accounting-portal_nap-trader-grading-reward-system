namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceSummary
{
    using System;
    public class ReportFilter
    {
        public string Trader { get; set; }

        public int ReportType { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }
    }
}
