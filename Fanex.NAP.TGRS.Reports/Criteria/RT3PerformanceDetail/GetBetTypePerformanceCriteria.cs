namespace Fanex.NAP.TGRS.Reports.Criteria.RT3PerformanceDetail
{
    using System;
    using Fanex.Data.Repository;

    public class GetBetTypePerformanceCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey()
            => "TGRS_Rpt_MultipleMatches";

        public override bool IsValid()
            => true;
    }
}