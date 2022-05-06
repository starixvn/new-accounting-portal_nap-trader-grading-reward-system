namespace Fanex.NAP.TGRS.Reports.Criteria.AutomationTradingPerformance
{
    using Fanex.Data;
    using Fanex.Data.Repository;

    public class GetLeaguePerformanceOfBetTypeCriteria : AutoTradingPerformanceCriteria
    {
        [SpParam(SqlParamName = "LeagueIds")]
        public string LeagueIdList { get; set; }

        [SpParam(SqlParamName = "BettypeId")]
        public int BetTypeId { get; set; }

        public override string GetSettingKey()
            => "TGRS_Rpt_RobotTrading_BetType_League";

    }
}