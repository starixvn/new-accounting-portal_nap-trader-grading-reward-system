namespace Fanex.NAP.TGRS.Reports.Models.Trader
{
    public class BetTypePerformance
    {
        public int BetType { get; set; }

        public string TypeName { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal? Margin { get; set; }

        public int BetCount { get; set; }

        public decimal TurnoverReal { get; set; }

        public decimal WinLossReal { get; set; }

        public decimal? MarginReal { get; set; }

    }
}
