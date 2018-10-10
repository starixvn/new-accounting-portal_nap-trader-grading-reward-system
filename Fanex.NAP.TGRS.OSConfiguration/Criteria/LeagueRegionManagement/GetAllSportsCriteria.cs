namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.LeagueRegionManagement
{
    using Fanex.Data.Repository;

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