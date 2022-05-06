namespace Fanex.NAP.TGRS.Reports.Criteria.ActualRatePerformanceDetail
{
    using Fanex.Data;
    using Fanex.Data.Repository;
    using System;

    public class GetActualRateMatchPerformanceOfBetTypeLeagueTraderCriteria : CriteriaBase
    {
        public short Bettype { get; set; }

        public int LeagueId { get; set; }

        public int CustId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public bool IsExcludeLeagues { get; set; }

        [SpParam(Ignored = true)]
        public bool IsViewScore { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_ARPerformanceDetail_Bettype_League_Trader_Match";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
