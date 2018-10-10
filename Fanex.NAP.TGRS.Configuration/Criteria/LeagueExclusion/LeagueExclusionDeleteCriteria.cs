namespace Fanex.NAP.TGRS.Configuration.Criteria.LeagueExclusion
{
    using Fanex.Data.Repository;

    public class LeagueExclusionDeleteCriteria : CriteriaBase
    {
        public int LeagueId { get; set; }

        public int UserId { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_LeagueExclusion_Delete";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}