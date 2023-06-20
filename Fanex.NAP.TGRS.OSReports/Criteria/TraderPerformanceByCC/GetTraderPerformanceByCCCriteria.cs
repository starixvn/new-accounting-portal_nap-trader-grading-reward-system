namespace Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformanceByCC
{
    using Fanex.Data.Repository;
    using System;

    public class GetTraderPerformanceByCCCriteria : CriteriaBase
    { 
        public string TraderName { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int SportId { get; set; }

        public string CustomerClassIds { get; set; }

        public string AllCustomerClassIds { get; set; }

        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_OS_Rpt_TraderPerformance_CustomerClass";
        }
    }
}