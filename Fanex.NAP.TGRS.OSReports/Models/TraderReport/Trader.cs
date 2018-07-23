namespace Fanex.NAP.TGRS.OSReports.Models.TraderReport
{
    public class Trader
    {
        public int TraderId { get; set; }

        public double Turnover { get; set; }

        public double Winlost { get; set; }

        public double Margin { get; set; }

        public int SportCount { get; set; }
    }
}