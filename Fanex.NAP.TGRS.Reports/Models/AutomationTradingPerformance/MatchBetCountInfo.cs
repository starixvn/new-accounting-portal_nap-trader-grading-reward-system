namespace Fanex.NAP.TGRS.Reports.Models.AutomationTradingPerformance
{
    using System;

    public class MatchBetCountInfo
    {
        public int BetType { get; set; }

        public DateTime RptMonth { get; set; }

        public int BetCount { get; set; }

        public int MatchCount { get; set; }
    }
}