namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail
{
    using Fanex.Data.Repository;
    using System;

    public class GetIntervalPerformanceOfBetTypeBetChoiceCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public short BetType { get; set; }

        public string BetChoice { get; set; }

        public bool IsFMBetType { get; set; }

        public bool IsExcludeLeagues { get; set; }

        public override string GetSettingKey()
            => "TGRS_Rpt_PerformanceDetail_Bettype_BetChoice_Interval";

        public override bool IsValid()
            => true;
    }
}
