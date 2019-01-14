namespace Fanex.NAP.TGRS.Configuration.Criteria.SystemConfiguration
{
    using Fanex.Data.Repository;

    public class LeagueExclusionConfigGetCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "TGRS_LeagueExclusion_SelectConfig";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}