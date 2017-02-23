namespace Fanex.NAP.TGRS.OSReports.Criteria.Dashboard
{
    using System;
    using Fanex.NAP.Framework.Data;

    public class GetTopNBestSportCriteria : CriteriaBase
    {
        public int Top { get; set; }

        public bool IsBottom
        {
            get
            {
                return false;
            }
        }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_Rpt_SummaryTopSport";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
