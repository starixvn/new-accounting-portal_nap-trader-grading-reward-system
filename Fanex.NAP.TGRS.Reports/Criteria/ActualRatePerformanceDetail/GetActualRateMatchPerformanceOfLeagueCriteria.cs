namespace Fanex.NAP.TGRS.Reports.Criteria.ActualRatePerformanceDetail
{
    using Fanex.Data.Repository;
    using System;

    public class GetActualRateMatchPerformanceOfLeagueCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int LeagueId { get; set; }

        public bool IsExcludeLeagues { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_ARPerformanceDetail_League_Match";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
