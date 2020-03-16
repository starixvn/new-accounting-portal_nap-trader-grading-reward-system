namespace Fanex.NAP.TGRS.Reports.Models.AutomationTradingPerformance
{
    using System;

    public class SummaryLeagueMatchBetCountInfo : LeagueMatchBetCountInfo
    {
        // BetType
        public int BetType { get; set; }

        // Period
        public DateTime RptMonth { get; set; }

        public string WeekDays { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        // Event
        public int LeagueGroupId { get; set; }

        public string LeagueIdList { get; set; }        
    }
}