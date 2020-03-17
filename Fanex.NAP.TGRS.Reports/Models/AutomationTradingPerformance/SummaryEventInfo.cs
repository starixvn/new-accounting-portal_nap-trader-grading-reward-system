namespace Fanex.NAP.TGRS.Reports.Models.AutomationTradingPerformance
{
    public class SummaryEventInfo : SummaryLeagueMatchBetCountInfo
    {
        public int LeagueGroupId { get; set; }

        public static SummaryEventInfo operator +(SummaryEventInfo info1, SummaryEventInfo info2)
        {
            if (info1 == null)
            {
                return info2;
            }

            if (info2 == null)
            {
                return info1;
            }

            var sumInfo = new SummaryEventInfo
            {
                LeagueGroupId = info1.LeagueGroupId,                
                LeagueIdList = info1.LeagueIdList + "," + info2.LeagueIdList,
                LeagueCount = info1.LeagueCount + info2.LeagueCount,
                MatchIdList = info1.MatchIdList + "," + info2.MatchIdList,
                MatchCount = info1.MatchCount + info2.MatchCount,
                BetCount = info1.BetCount + info2.BetCount,
            };

            return sumInfo;
        }
    }
}