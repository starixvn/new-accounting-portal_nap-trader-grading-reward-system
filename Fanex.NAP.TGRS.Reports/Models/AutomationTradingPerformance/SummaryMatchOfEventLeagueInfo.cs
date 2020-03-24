namespace Fanex.NAP.TGRS.Reports.Models.AutomationTradingPerformance
{
    using System;

    public class SummaryMatchOfEventLeagueInfo : SummaryLeagueMatchBetCountInfo
    {
        public int MatchId { get; set; }

        public DateTime EventDate { get; set; }

        public int HomeId { get; set; }

        public int AwayId { get; set; }

    }
}
