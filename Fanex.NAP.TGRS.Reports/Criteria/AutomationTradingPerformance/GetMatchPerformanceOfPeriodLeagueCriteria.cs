namespace Fanex.NAP.TGRS.Reports.Criteria.AutomationTradingPerformance
{
    using Fanex.Data.Repository;

    public class GetMatchPerformanceOfPeriodLeagueCriteria : AutoTradingPerformanceCriteria
    {
        [SpParam(SqlParamName = "MatchIds")]
        public string MatchIdList { get; set; }

        public override string GetSettingKey()
            => "TGRS_Rpt_RobotTrading_Period_League_Match";

    }
}