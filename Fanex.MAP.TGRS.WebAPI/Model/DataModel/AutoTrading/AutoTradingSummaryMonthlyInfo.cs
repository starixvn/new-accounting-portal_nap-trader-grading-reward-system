namespace Fanex.MAP.TGRS.WebAPI.Model.DataModel.AutoTrading
{
    using System;

    public class AutoTradingSummaryMonthlyInfo
    {
        public DateTime RptMonth { get; set; }

        public string LeagueIdList { get; set; }

        public int LeagueCount { get; set; }
       
        public int MatchCount { get; set; }

        public int BetCount { get; set; }

        public static AutoTradingSummaryMonthlyInfo operator +(AutoTradingSummaryMonthlyInfo info1, AutoTradingSummaryMonthlyInfo info2)
        {
            if (info1 == null)
            {
                return info2;
            }

            if (info2 == null)
            {
                return info1;
            }

            return new AutoTradingSummaryMonthlyInfo
            {
                BetCount = info1.BetCount + info2.BetCount,
                MatchCount = info1.MatchCount + info2.MatchCount
            };
        }
    }
}