namespace Fanex.NAP.TGRS.Reports.Models.AutomationTradingPerformance
{
    public class SummaryLeagueOfEventInfo : SummaryLeagueMatchBetCountInfo
    {
        public int LeagueGroupId { get; set; }

        public int LeagueId { get; set; }

        public string LeagueName { get; set; }

        public static SummaryLeagueOfEventInfo operator +(SummaryLeagueOfEventInfo info1, SummaryLeagueOfEventInfo info2)
        {
            if (info1 == null)
            {
                return info2;
            }

            if (info2 == null)
            {
                return info1;
            }

            var sumInfo = new SummaryLeagueOfEventInfo
            {
                LeagueGroupId = info1.LeagueGroupId,
                LeagueId = 0,
                MatchCount = info1.MatchCount + info2.MatchCount,
                BetCount = info1.BetCount + info2.BetCount,
            };

            return sumInfo;
        }

    }
}