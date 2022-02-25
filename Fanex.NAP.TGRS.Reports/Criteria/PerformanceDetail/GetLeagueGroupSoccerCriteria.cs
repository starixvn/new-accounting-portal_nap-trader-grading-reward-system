namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail
{
    using Fanex.Data.Repository;

    public class GetLeagueGroupSoccerCriteria : CriteriaBase
    {
        public string LeagueGroupIds { get; set; }     

        public override string GetSettingKey()
        {
            return "TGRS_LeagueGroupSoccer_Get";
        }

        public override bool IsValid()
        {
            return true;
        }

    }
}
