namespace Fanex.NAP.TGRS.OSReports.Criteria.Dashboard
{
    using System;
    using Fanex.Data.Repository;

    public class GetDataByMonthCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_Rpt_SummaryDataByMonth";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
