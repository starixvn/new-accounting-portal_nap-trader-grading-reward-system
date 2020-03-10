namespace Fanex.NAP.TGRS.Reports.Criteria.AutomationTradingPerformance
{
    public class GetWeekPerformanceCriteria : GetMonthPerformanceCriteria
    {
        public override string GetSettingKey()
           => "TGRS_Rpt_RobotTrading_Week";
    }
}