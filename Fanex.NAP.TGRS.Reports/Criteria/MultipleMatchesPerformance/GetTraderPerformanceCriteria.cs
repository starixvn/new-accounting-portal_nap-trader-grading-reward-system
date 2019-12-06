namespace Fanex.NAP.TGRS.Reports.Criteria.MultipleMatchesPerformance
{
    using System;
    using Fanex.Data.Repository;

    /// <summary>
    /// Getting trader performance criteria.
    /// </summary>
    public class GetTraderPerformanceCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey()
            => "TGRS_Rpt_MultipleMatches";

        public override bool IsValid()
            => true;
    }
}