namespace Fanex.NAP.TGRS.OSReports.Criteria.NewSportPerformance
{
    using Fanex.NAP.Framework.Data;
    using System;

    public class GetLeaguePerformanceCriteria : CriteriaBase
    {
        public int ReportType { get; set; }

        public int SportId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_Rpt_NewSportPerformance_League";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}