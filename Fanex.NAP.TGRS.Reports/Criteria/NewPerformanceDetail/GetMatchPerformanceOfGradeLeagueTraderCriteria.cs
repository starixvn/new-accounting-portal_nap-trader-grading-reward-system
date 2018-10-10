namespace Fanex.NAP.TGRS.Reports.Criteria.NewPerformanceDetail
{
    using Fanex.Data.Repository;
    using System;

    public class GetMatchPerformanceOfGradeLeagueTraderCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int LeagueId { get; set; }

        public int CustId { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_NewPerformanceDetail_Grade_League_Trader_Match";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}