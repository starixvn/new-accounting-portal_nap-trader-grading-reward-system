namespace Fanex.NAP.TGRS.OSReports.Criteria.BasketballPerformance
{
    using Fanex.Data.Repository;
    using System;

    public class GetLeagueOfBettypeBetChoiceQuarterCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string LeagueName { get; set; }

        public string LeagueGroupIds { get; set; }

        public int Bettype { get; set; }

        public string BetChoice { get; set; }

        public int LiveType { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Basketball_Rpt_PerformanceDetail_Bettype_BetChoice_Quarter_League";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
