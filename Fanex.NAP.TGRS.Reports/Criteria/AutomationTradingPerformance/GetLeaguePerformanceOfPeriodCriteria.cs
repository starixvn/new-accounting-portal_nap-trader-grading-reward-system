namespace Fanex.NAP.TGRS.Reports.Criteria.AutomationTradingPerformance
{
    using Fanex.Data.Repository;

    public class GetLeaguePerformanceOfPeriodCriteria : AutoTradingPerformanceCriteria
    {
        [SpParam(SqlParamName = "LeagueIds")]
        public string LeagueIdList { get; set; }

        [SpParam(SqlParamName = "IsExportExcel")]
        public bool IsExportEventLeague { get; set; }

        public override string GetSettingKey()
            => "TGRS_Rpt_RobotTrading_Event_League";

    }
}
