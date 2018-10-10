namespace Fanex.NAP.TGRS.Configuration.Criteria.LeagueExclusion
{
    using Fanex.Data.Repository;

    public class LeagueGetCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "TGRS_LeagueExclusion_SelectAll";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}