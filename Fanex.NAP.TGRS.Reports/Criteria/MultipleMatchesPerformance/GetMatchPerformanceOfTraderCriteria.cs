namespace Fanex.NAP.TGRS.Reports.Criteria.MultipleMatchesPerformance
{
    using Fanex.Data.Repository;
    using System;

    public class GetMatchPerformanceOfTraderCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int CustId { get; set; }
        
        public string MatchIds { get; set; }

        public string Bettypes { get; set; }

        public bool IsExcludeLeagues { get; set; }

        public bool Market => true;

        public override string GetSettingKey()
            => "TGRS_Rpt_MultipleMatches_Match";

        public override bool IsValid()
            => true;
    }
}