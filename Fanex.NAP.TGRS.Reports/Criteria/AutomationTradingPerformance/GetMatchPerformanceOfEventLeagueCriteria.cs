namespace Fanex.NAP.TGRS.Reports.Criteria.AutomationTradingPerformance
{
    using Fanex.Data;

    public class GetMatchPerformanceOfEventLeagueCriteria : AutoTradingPerformanceCriteria
    {
        [SpParam(SqlParamName = "MatchIds")]
        public string MatchIdList { get; set; }

        public override string GetSettingKey()
            => "TGRS_Rpt_RobotTrading_Event_League_Match";

    }
}
