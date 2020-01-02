namespace Fanex.NAP.TGRS.Reports.Criteria.RT3PerformanceDetail
{   
    public class GetBetTypePerformanceCriteria : RT3PerformanceCriteria
    {
        public override string GetSettingKey()
            => "TGRS_Rpt_RobotTrading_BetType";

        public override bool IsValid()
            => true;
    }
}