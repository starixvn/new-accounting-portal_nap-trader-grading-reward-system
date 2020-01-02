namespace Fanex.NAP.TGRS.Reports.Criteria.RT3PerformanceDetail
{    
    public class GetMonthPerformanceCriteria : RT3PerformanceCriteria
    {       
        public override string GetSettingKey()
            => "TGRS_Rpt_RobotTrading_Monthly";

        public override bool IsValid()
            => true;
    }
}