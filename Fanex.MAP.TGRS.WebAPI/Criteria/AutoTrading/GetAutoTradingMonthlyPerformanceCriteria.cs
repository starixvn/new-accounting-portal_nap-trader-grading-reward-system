namespace Fanex.MAP.TGRS.WebAPI.Criteria.AutoTrading
{
    public class GetAutoTradingMonthlyPerformanceCriteria : AutoTradingPerformanceCriteria
    {
        public string LeagueGroupIds { get; set; }
      
        public override string GetSettingKey()
           => "TGRS_Rpt_RobotTrading_Monthly";

    }
}