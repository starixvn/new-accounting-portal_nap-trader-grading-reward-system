namespace Fanex.NAP.TGRS.OSReports.Criteria.TraderReport
{
    using Fanex.Data.Repository;
    using System;

    public class GetGeneralInfoCriteria : CriteriaBase
    {
        public string TraderName { get; set; }

        public int ReportType { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int ViewPermission { get; set; } = 0;

        public override string GetSettingKey() => "TGRS_OS_Rpt_TraderReport";

        public override bool IsValid() => true;
    }
}