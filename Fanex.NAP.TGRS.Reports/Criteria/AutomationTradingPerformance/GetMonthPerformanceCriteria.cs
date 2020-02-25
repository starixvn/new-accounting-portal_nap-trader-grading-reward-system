namespace Fanex.NAP.TGRS.Reports.Criteria.AutomationTradingPerformance
{
    using Fanex.Data.Repository;
    using System;

    public class GetMonthPerformanceCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int Model { get; set; }

        public string LeagueGroupIds { get; set; }

        public string TypeSiteIds { get; set; }

        [SpParam(Ignored = true)]
        public string Measurements { get; set; }

        [SpParam(Ignored = true)]
        public string MeasurementHides { get; set; }

        [SpParam(Ignored = true)]
        public string MeasurementDescs { get; set; }

        public override string GetSettingKey()
            => "TGRS_Rpt_RobotTrading_Monthly";

        public override bool IsValid()
            => true;
    }
}