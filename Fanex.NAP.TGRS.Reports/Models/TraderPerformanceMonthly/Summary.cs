namespace Fanex.NAP.TGRS.Reports.Models.TraderPerformanceMonthly
{
    using Fanex.NAP.TGRS.Core.Helpers;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    [JsonObject]
    public class Summary
    {
        public static JObject Columns { get; }

        [JsonIgnore]
        public int TraderId { get; set; }

        [JsonProperty("Match")]
        public int MatchCount { get; set; }

        public double Turnover { get; set; }

        public double Winloss { get; set; }

        [JsonProperty("Margin(%)")]
        public double Margin => Winloss / Turnover * 100;

        [JsonProperty("Bet Count")]
        public ulong BetCount { get; set; }

        public static Summary operator +(Summary s1, Summary s2)
        {
            if (s1 == null) return s2;

            if (s2 == null) return s1;

            return new Summary
            {
                MatchCount = s1.MatchCount + s2.MatchCount,
                Turnover = s1.Turnover + s2.Turnover,
                Winloss = s1.Winloss + s2.Winloss,
                BetCount = s1.BetCount + s2.BetCount
            };
        }

        static Summary()
        {
            Columns = ViewModelHelper.GetJColumns<Summary>();
        }
    }
}