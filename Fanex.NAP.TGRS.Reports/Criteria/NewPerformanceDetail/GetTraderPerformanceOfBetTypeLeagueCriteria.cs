namespace Fanex.NAP.TGRS.Reports.Criteria.NewPerformanceDetail
{
    using Fanex.Data.Repository;
    using System;

    public class GetTraderPerformanceOfBetTypeLeagueCriteria : CriteriaBase
    {
        public short BetType { get; set; }

        public int LeagueId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        [SpParam(Ignored = true)]
        public bool IsViewScore { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_NewPerformanceDetail_Bettype_League_Trader";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}