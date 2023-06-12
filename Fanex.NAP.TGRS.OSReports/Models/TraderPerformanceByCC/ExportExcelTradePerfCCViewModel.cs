namespace Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformanceByCC
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class ExportExcelTradePerfCCViewModel
    { 
        public string TraderName { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int SportId { get; set; }

        public string SportName { get; set; }

        public string CustomerClassIds { get; set; }

        public string DisplayCustomerClassIds
        {
            get
            {
                if (!string.IsNullOrEmpty(CustomerClassIds))
                {
                    return CustomerClassIds.Replace("-999", "Unknown");
                }; 

                return string.Empty;
            }
        }

        public string AllCustomerClassIds { get; set; }
    }
}