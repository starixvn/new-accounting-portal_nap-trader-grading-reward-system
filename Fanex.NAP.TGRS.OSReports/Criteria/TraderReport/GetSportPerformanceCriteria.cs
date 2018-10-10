namespace Fanex.NAP.TGRS.OSReports.Criteria.TraderReport
{
    using Fanex.Data.Repository;
    using System;

    public class GetSportPerformanceCriteria : CriteriaBase
    {
        public int TraderId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int ReportType { get; set; }

        public override string GetSettingKey() => "TGRS_OS_Rpt_TraderReport_SportPerformance";

        public override bool IsValid() => true;
    }
}