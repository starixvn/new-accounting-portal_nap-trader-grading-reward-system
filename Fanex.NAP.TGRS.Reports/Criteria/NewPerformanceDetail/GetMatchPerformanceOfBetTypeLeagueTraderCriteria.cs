namespace Fanex.NAP.TGRS.Reports.Criteria.NewPerformanceDetail
{
    using Fanex.NAP.Framework.Data;
    using System;

    public class GetMatchPerformanceOfBetTypeLeagueTraderCriteria : CriteriaBase
    {
        public short Bettype { get; set; }

        public int LeagueId { get; set; }

        public int CustId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_NewPerformanceDetail_Bettype_League_Trader_Match";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}