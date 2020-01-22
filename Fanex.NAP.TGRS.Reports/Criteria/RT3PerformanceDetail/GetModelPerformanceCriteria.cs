namespace Fanex.NAP.TGRS.Reports.Criteria.RT3PerformanceDetail
{
    using Fanex.Data.Repository;
    using System;

    public class GetModelPerformanceCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        [SpParam(Ignored = true)]
        public string DataType { get; set; }

        public override string GetSettingKey()
            => "TGRS_Rpt_RobotTrading_Model";

        public override bool IsValid()
            => true;
    }
}