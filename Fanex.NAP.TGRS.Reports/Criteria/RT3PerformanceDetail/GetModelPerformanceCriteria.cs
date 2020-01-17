namespace Fanex.NAP.TGRS.Reports.Criteria.RT3PerformanceDetail
{
    using Fanex.Data.Repository;
    using System;

    public class GetModelPerformanceCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string DataType { get; set; }

        public override string GetSettingKey()
            => "TGRS_Rpt_RobotTrading_BetType";

        public override bool IsValid()
            => true;
    }
}