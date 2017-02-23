namespace Fanex.NAP.TGRS.OSReports.Criteria.Dashboard
{
    using System;
    using Fanex.NAP.Framework.Data;

    public class GetDataByMonthCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_Rpt_SummaryData";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
