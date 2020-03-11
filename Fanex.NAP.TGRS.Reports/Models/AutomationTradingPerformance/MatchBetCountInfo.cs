namespace Fanex.NAP.TGRS.Reports.Models.AutomationTradingPerformance
{
    using System;

    public class MatchBetCountInfo
    {
        public int BetType { get; set; }

        public DateTime RptMonth { get; set; }

        public string WeekDays { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int LeagueCount { get; set; }

        public int BetCount { get; set; }

        public int MatchCount { get; set; }

    }
}
