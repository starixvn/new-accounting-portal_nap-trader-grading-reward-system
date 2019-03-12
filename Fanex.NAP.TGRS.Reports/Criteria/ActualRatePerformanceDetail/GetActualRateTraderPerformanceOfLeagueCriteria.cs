namespace Fanex.NAP.TGRS.Reports.Criteria.ActualRatePerformanceDetail
{
    using Fanex.Data.Repository;
    using System;

    public class GetActualRateTraderPerformanceOfLeagueCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int LeagueId { get; set; }

        public bool IsExcludeLeagues { get; set; }

        [SpParam(Ignored = true)]
        public bool IsViewScore { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_ARPerformanceDetail_League_Trader";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
