namespace Fanex.MAP.TGRS.WebAPI.Model.DataModel.AutoTrading
{
    public class AutoTradingSummaryInfo
    {
        public int LeagueCount { get; set; }

        public int MatchCount { get; set; }

        public int BetCount { get; set; }

        public static AutoTradingSummaryInfo operator +(AutoTradingSummaryInfo info1, AutoTradingSummaryInfo info2)
        {
            if (info1 == null)
            {
                return info2;
            }

            if (info2 == null)
            {
                return info1;
            }

            return new AutoTradingSummaryInfo
            {
                BetCount = info1.BetCount + info2.BetCount,
                MatchCount = info1.MatchCount + info2.MatchCount
            };
        }
    }
}