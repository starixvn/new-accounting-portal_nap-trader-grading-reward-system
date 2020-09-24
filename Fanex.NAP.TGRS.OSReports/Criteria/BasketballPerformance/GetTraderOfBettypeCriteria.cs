namespace Fanex.NAP.TGRS.OSReports.Criteria.BasketballPerformance
{
    using Fanex.Data.Repository;
    using System;

    public class GetTraderOfBettypeCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string LeagueName { get; set; }

        public string LeagueGroupIds { get; set; }

        public int Bettype { get; set; }

        public int LiveType { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Basketball_Rpt_PerformanceDetail_Bettype_Trader";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
