namespace Fanex.NAP.TGRS.Reports.Criteria.MultipleMatchesPerformance
{
    using Fanex.Data.Repository;
    using System;

    public class GetBettypeDetailOfTraderCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int CustId { get; set; }

        public int MatchId { get; set; }

        public string Bettypes { get; set; }

        public override string GetSettingKey()
            => "TGRS_Rpt_PerformanceDetail_Trader_Match_Bettype";

        public override bool IsValid()
            => true;
    }
}