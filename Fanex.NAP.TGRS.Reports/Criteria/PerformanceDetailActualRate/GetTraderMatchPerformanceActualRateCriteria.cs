namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetailActualRate
{
    using Fanex.Data.Repository;
    using System;

    public class GetTraderMatchPerformanceActualRateCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int CustId { get; set; }

        public bool IsExcludeLeagues { get; set; }

        [SpParam(Ignored = true)]
        public bool IsViewScore { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_ARPerformanceDetail_Trader_Match";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
