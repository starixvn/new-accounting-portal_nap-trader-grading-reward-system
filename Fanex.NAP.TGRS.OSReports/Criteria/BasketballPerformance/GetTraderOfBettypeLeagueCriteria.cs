namespace Fanex.NAP.TGRS.OSReports.Criteria.BasketballPerformance
{
    using Fanex.Data.Repository;
    using System;

    public class GetTraderOfBettypeLeagueCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int LeagueId { get; set; }

        public int Bettype { get; set; }

        public int LiveType { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Basketball_Rpt_PerformanceDetail_Bettype_League_Trader";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
