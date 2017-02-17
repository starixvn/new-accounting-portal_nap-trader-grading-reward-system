namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.LeagueRegionManagement
{
    using Fanex.NAP.Framework.Data;

    public class GetAllSportsCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "TGRS_OS_SportGetAll";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}