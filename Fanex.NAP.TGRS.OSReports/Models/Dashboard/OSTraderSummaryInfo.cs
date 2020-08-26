namespace Fanex.NAP.TGRS.OSReports.Models.Dashboard
{
    public class OSTraderSummaryInfo
    {
        public int TraderId { get; set; }

        public string Username { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal Margin { get; set; }
    }
}
