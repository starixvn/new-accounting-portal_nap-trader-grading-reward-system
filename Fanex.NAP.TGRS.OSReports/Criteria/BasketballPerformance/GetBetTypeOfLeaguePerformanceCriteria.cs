using Fanex.Data.Repository;
using System;

namespace Fanex.NAP.TGRS.OSReports.Criteria.BasketballPerformance
{
    public class GetBetTypeOfLeaguePerformanceCriteria: CriteriaBase, BasePerformanceCriteria
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }
        public string LeagueName { get; set; }
        public string LeagueGroupIds { get; set; }
        public string Bettypes { get; set; }

        public int LeagueId { get; set; }

        public int MatchId { get; set; }

        public int LiveType { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Basketball_Rpt_PerformanceDetail_League_BetType";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
