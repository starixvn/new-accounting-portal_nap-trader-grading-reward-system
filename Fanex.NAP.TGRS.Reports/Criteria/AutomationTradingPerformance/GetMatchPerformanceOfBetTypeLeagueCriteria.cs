namespace Fanex.NAP.TGRS.Reports.Criteria.AutomationTradingPerformance
{
    using Fanex.Data.Repository;

    public class GetMatchPerformanceOfBetTypeLeagueCriteria : AutoTradingPerformanceCriteria
    {
        [SpParam(SqlParamName = "MatchIds")]
        public string MatchIdList { get; set; }

        [SpParam(SqlParamName = "BettypeId")]
        public int BetTypeId { get; set; }

        public override string GetSettingKey()
            => "TGRS_Rpt_RobotTrading_BetType_League_Match";

    }
}