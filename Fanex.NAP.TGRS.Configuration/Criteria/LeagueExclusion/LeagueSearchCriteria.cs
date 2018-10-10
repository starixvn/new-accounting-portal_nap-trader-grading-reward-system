namespace Fanex.NAP.TGRS.Configuration.Criteria.LeagueExclusion
{
    using Fanex.Data.Repository;

    public class LeagueSearchCriteria : CriteriaBase
    {
        public string LeagueName { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_League_SelectByName";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}