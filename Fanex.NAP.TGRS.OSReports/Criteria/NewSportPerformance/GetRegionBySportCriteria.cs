namespace Fanex.NAP.TGRS.OSReports.Criteria.NewSportPerformance
{
    using Fanex.Data.Repository;
    using System;

    public class GetRegionBySportCriteria : CriteriaBase
    {
        public int ReportType { get; set; }

        public int SportId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_OS_Rpt_NewSportPerformance_Region";
        }
    }
}
