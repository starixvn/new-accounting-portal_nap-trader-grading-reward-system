using System;

namespace Fanex.NAP.TGRS.OSReports.Criteria.BasketballPerformance
{
    public interface BasePerformanceCriteria
    {
        DateTime FromDate { get; set; }

        DateTime ToDate { get; set; }

        string LeagueName { get; set; }

        string LeagueGroupIds { get; set; }

        string Bettypes { get; set; }

        int LiveType { get; set; }
    }
}
