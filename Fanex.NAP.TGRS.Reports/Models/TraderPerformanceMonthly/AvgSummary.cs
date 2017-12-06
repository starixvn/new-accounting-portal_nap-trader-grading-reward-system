namespace Fanex.NAP.TGRS.Reports.Models.TraderPerformanceMonthly
{
    using Fanex.NAP.TGRS.Core.Helpers;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    [JsonObject]
    public class AvgSummary : Summary
    {
        public static new JObject Columns { get; }

        [JsonProperty("Avg.Mth")]
        public double AvgMargin => Turnover / MatchCount;

        [JsonProperty("Avg.BT")]
        public int AvgBetCount => (int)(Turnover / BetCount);

        public static AvgSummary Cast(Summary s)
        {
            if (s == null) return null;

            return new AvgSummary
            {
                BetCount = s.BetCount,
                MatchCount = s.MatchCount,
                TraderId = s.TraderId,
                Turnover = s.Turnover,
                Winloss = s.Winloss
            };
        }

        public static AvgSummary operator +(AvgSummary s1, AvgSummary s2)
        {
            if (s1 == null) return s2;

            if (s2 == null) return s1;

            return new AvgSummary
            {
                MatchCount = s1.MatchCount + s2.MatchCount,
                Turnover = s1.Turnover + s2.Turnover,
                Winloss = s1.Winloss + s2.Winloss,
                BetCount = s1.BetCount + s2.BetCount
            };
        }

        static AvgSummary()
        {
            Columns = ViewModelHelper.GetJColumns<AvgSummary>();
        }
    }
}