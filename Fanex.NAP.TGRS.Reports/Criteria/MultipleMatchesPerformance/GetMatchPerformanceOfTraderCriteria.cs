namespace Fanex.NAP.TGRS.Reports.Criteria.MultipleMatchesPerformance
{
    using Fanex.Data.Repository;
    using System;

    public class GetMatchPerformanceOfTraderCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int CustId { get; set; }

        public override string GetSettingKey()
            => "TGRS_Rpt_MultipleMatches";

        public override bool IsValid()
            => true;
    }
}