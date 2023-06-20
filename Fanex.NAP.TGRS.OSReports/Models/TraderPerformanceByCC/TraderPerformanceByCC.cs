namespace Fanex.NAP.TGRS.OSReports.Models.TraderPerformanceByCC
{
    public class TraderPerformanceByCCModel
    {
        public int TraderId { get; set; }

        public string TraderName { get; set; }

        public string CustomerClass { get; set; }

        public double Margin { get; set; }

        public double Turnover { get; set; }

        public double WinLoss { get; set; }

        public double MarginReal { get; set; }

        public double TurnoverReal { get; set; }

        public double WinLossReal { get; set; }

        public int BetCount { get; set; }
    }
}