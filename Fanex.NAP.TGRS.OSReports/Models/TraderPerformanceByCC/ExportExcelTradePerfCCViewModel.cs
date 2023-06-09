namespace Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformanceByCC
{
    using System;

    public class ExportExcelTradePerfCCViewModel
    { 
        public string TraderName { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int SportId { get; set; }

        public string SportName { get; set; }

        public string CustomerClassIds { get; set; }

        public string AllCustomerClassIds { get; set; }
    }
}