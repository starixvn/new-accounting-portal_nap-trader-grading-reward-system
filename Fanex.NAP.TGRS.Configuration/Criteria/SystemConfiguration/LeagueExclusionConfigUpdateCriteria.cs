namespace Fanex.NAP.TGRS.Configuration.Criteria.SystemConfiguration
{
    using Fanex.Data.Repository;

    public class LeagueExclusionConfigUpdateCriteria : CriteriaBase
    {
        public bool OnOffValue { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        /// <summary>
        /// Gets Setting Key.
        /// </summary>
        /// <returns>Setting key of the criteria.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_LeagueExclusion_UpdateConfig";
        }

        /// <summary>
        /// Checks validation of the criteria.
        /// </summary>
        /// <returns>Whether or not the criteria is valid.</returns>
        public override bool IsValid()
        {
            return true;
        }
    }
}
