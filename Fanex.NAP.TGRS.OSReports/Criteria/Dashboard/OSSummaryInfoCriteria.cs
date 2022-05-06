namespace Fanex.NAP.TGRS.OSReports.Criteria.Dashboard
{
    using System;
    using Fanex.Data;
    using Fanex.Data.Repository;

    public class OSSummaryInfoCriteria : CriteriaBase
    {
        public string SportIds { get; set; }

        public int ReportType { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        [SpParam(Ignored = true)]
        public DayType DayType { get; set; }

        public override string GetSettingKey()
        {
            return "";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}