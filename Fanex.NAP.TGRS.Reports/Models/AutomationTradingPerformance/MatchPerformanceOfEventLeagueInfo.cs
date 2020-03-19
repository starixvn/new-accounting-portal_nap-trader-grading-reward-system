namespace Fanex.NAP.TGRS.Reports.Models.AutomationTradingPerformance
{
    using System;

    public class MatchPerformanceOfEventLeagueInfo : RTModelPerformanceInfo
    {
        public int MatchId { get; set; }

        public DateTime EventDate { get; set; }

    }
}