namespace Fanex.NAP.TGRS.OSReports.Models.TraderPerformance
{
    public class SportPerformance
    {
        public int SportId { get; set; }

        public string SportName { get; set; }

        public int NoOfLeague { get; set; }

        public int RegionCount { get; set; }

        public double TotalPoint { get; set; }

        public double Margin { get; set; }

        public double Turnover { get; set; }

        public double WinLoss { get; set; }

        public int EventProductCount { get; set; }

        public int BetCount { get; set; }
    }
}
