namespace Fanex.NAP.TGRS.Reports.Criteria.AutomationTradingPerformance
{
    public class GetMonthPerformanceCriteria : AutoTradingPerformanceCriteria
    {
        public string LeagueGroupIds { get; set; }                

        public override string GetSettingKey()
            => "TGRS_Rpt_RobotTrading_Monthly";     
    }
}