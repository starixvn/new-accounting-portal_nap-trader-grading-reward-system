namespace Fanex.NAP.TGRS.OSReports.Models.TraderPerformance
{
    public class RegionPerformance
    {
        public string RegionName { get; set; }

        public double Margin { get; set; }

        public double Turnover { get; set; }

        public double WinLoss { get; set; }

        public int EventProductCount { get; set; }

        public int BetCount { get; set; }
    }
}
