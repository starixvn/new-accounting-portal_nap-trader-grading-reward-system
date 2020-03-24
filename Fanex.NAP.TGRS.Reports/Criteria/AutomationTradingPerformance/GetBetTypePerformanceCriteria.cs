namespace Fanex.NAP.TGRS.Reports.Criteria.AutomationTradingPerformance
{
    public class GetBetTypePerformanceCriteria : AutoTradingPerformanceCriteria
    {      
        public string LeagueGroupIds { get; set; }           

        public override string GetSettingKey()
            => "TGRS_Rpt_RobotTrading_BetType";      
    }
}