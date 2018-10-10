namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.LeagueRegionManagement
{
    using Fanex.Data.Repository;

    public class GetLeagueRegionCriteria : CriteriaBase
    {
        public string LeagueName { get; set; }

        public int SportId { get; set; }

        public int RegionId { get; set; }

        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_OS_LeagueRegionGet";
        }
    }
}