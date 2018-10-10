namespace Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformance
{
    using Fanex.Data.Repository;
    using System;

    public class GetRegionByTraderCriteria : CriteriaBase
    {
        public int ReportType { get; set; }

        public int TraderId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int SportId { get; set; }

        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_OS_Rpt_TraderPerformance_Region";
        }
    }
}
