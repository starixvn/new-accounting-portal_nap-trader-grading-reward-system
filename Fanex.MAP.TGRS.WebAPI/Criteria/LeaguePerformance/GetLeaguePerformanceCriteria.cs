namespace Fanex.MAP.TGRS.WebAPI.Criteria.LeaguePerformance
{
    using Fanex.Data.Repository;
    using System;

    public class GetLeaguePerformanceCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string SportName { get; set; }

        public string LeagueName { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_API_LeaguePerformance_Get";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}