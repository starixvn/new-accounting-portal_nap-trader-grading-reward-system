namespace Fanex.NAP.TGRS.Reports.Models.AutomationTradingPerformance
{
    using System;

    public class SummaryPeriodInfo : SummaryLeagueMatchBetCountInfo
    {
        public DateTime RptMonth { get; set; }

        public string WeekDays { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }
    }
}