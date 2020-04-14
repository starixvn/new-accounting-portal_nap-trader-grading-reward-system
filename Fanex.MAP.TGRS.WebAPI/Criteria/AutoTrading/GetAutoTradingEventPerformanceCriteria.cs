namespace Fanex.MAP.TGRS.WebAPI.Criteria.AutoTrading
{
    public class GetAutoTradingEventPerformanceCriteria : AutoTradingPerformanceCriteria
    {
        public override string GetSettingKey()
           => "TGRS_Rpt_RobotTrading_Event";
    }
}