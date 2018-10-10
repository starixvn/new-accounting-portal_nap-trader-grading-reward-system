namespace Fanex.NAP.TGRS.Configuration.Criteria.LeagueExclusion
{
    using Fanex.Data.Repository;

    public class LeagueExclusionInsertCriteria : CriteriaBase
    {
        public int LeagueId { get; set; }

        public int UserId { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_LeagueExclusion_Insert";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}