namespace Fanex.NAP.TGRS.OSReports.Criteria.Dashboard
{
    using System;
    using Fanex.Data.Repository;

    public class GetDataByRegionCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_Rpt_SummaryDataByRegion";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
