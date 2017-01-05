namespace Fanex.NAP.TGRS.Reports.Criteria.NewPerformanceDetail
{
    using Fanex.NAP.Framework.Data;
    using System;

    public class GetTraderPerformanceOfBetTypeLeagueCriteria : CriteriaBase
    {
        public short BetType { get; set; }

        public int LeagueId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

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