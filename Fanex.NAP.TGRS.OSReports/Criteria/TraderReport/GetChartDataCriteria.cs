namespace Fanex.NAP.TGRS.OSReports.Criteria.TraderReport
{
    using Fanex.NAP.Framework.Data;
    using System;

    public class GetChartDataCriteria : CriteriaBase
    {
        public int TraderId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int ReportType { get; set; }

        public int ViewPermission { get; set; }

        public override string GetSettingKey() => "TGRS_OS_Rpt_TraderReport_Chart";

        public override bool IsValid() => true;
    }
}