namespace Fanex.NAP.TGRS.Reports.ViewModels.Trader
{
    public class BettypeOfMatch
    {
        public int Bettype { get; set; }

        public string TypeName { get; set; }

        public decimal Turnover { get; set; }

        public decimal Winloss { get; set; }        

        public decimal? Margin { get; set; }

        public decimal TurnoverReal { get; set; }

        public decimal WinlossReal { get; set; }

        public decimal? MarginReal { get; set; }

        public int BetCount { get; set; }

    }
}
