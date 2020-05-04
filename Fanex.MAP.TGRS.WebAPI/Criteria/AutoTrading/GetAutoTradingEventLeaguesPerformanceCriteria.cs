namespace Fanex.MAP.TGRS.WebAPI.Criteria.AutoTrading
{
    public class GetAutoTradingEventLeaguesPerformanceCriteria : AutoTradingPerformanceCriteria
    {
        public string LeagueIds { get; set; }

        public bool IsExportExcel { get; set; }

        public override string GetSettingKey()
           => "TGRS_Rpt_RobotTrading_Event_League";

    }
}