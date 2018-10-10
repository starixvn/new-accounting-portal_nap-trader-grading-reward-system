namespace Fanex.NAP.TGRS.Reports.Criteria.NewPerformanceDetail
{
    using Fanex.Data.Repository;
    using System;

    public class GetBetTypePerformanceOfGradeLeagueTraderMatchCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int CustId { get; set; }

        public int MatchId { get; set; }

        [SpParam(Ignored = true)]
        public bool IsViewScore { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_NewPerformanceDetail_Grade_League_Trader_Match_Bettype";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}