namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail
{
    using Fanex.Data.Repository;
    using System;

    public class GetBetChoicePerformanceOfBetTypeCriteria : CriteriaBase
    {
        public short BetType { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public bool IsExcludeLeagues { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_PerformanceDetail_Bettype_BetChoice";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}