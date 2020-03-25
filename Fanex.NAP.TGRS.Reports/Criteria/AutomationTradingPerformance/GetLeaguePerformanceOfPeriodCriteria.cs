namespace Fanex.NAP.TGRS.Reports.Criteria.AutomationTradingPerformance
{
    using Fanex.Data.Repository;

    public class GetLeaguePerformanceOfPeriodCriteria : AutoTradingPerformanceCriteria
    {
        [SpParam(SqlParamName = "LeagueIds")]
        public string LeagueIdList { get; set; }     

        public override string GetSettingKey()
            => "TGRS_Rpt_RobotTrading_Period_League";

    }
}
