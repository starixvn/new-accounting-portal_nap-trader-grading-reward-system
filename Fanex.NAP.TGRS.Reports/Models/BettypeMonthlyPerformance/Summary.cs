namespace Fanex.NAP.TGRS.Reports.Models.BettypeMonthlyPerformance
{
    public class Summary
    {
        public int MatchCount { get; set; }

        public double Turnover { get; set; }

        public double Winloss { get; set; }

        public double Margin => Turnover == 0 ? 0 : Winloss / Turnover;

        public int BetCount { get; set; }

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
    }
}