namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.LeagueRegionManagement
{
    using Fanex.Data.Repository;

    public class UpdateLeagueRegionCriteria : CriteriaBase
    {
        public int LeagueId { get; set; }

        public int RegionId { get; set; }

        public int CreatorId { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_LeagueRegionUpdate";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}