namespace Fanex.NAP.TGRS.Reports.Criteria.NewPerformanceDetail
{
    public class GetMatchPerformanceOfLeagueNameCriteria: GetLeaguePerformanceCriteria
    {
        public override string GetSettingKey()
        {
            return "TGRS_Rpt_NewPerformanceDetail_LeagueAllMatch";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}