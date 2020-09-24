namespace Fanex.NAP.TGRS.OSReports.Criteria.BasketballPerformance
{
    using Fanex.Data.Repository;

    public class GetLeagueGroupBySportCriteria : CriteriaBase
    {
        public int SportId { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_LeagueGroup_GetBySportId";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
