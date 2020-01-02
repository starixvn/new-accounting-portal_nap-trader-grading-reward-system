namespace Fanex.NAP.TGRS.Reports.Criteria.RT3PerformanceDetail
{    
    using Fanex.Data.Repository;
    using System;

    public class RT3PerformanceCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string LeagueGroupIds { get; set; }
    }
}