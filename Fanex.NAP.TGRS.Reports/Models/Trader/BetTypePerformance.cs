namespace Fanex.NAP.TGRS.Reports.Models.Trader
{
    public class BetTypePerformance
    {
        public int BetType { get; set; }

        public string TypeName { get; set; }

        public decimal Turnover { get; set; }

        public decimal Winlost { get; set; }

        public decimal? Margin { get; set; }

        public int BetCount { get; set; }

        public decimal StakeReal { get; set; }

        public decimal WinLostReal { get; set; }

        public decimal? MarginReal { get; set; }

    }
}
