namespace Fanex.NAP.TGRS.OSReports.Models.NewTraderPerformance
{
    public class RegionPerformance
    {
        public string RegionName { get; set; }

        public double JuiceMarginTotal { get; set; }

        public double JuiceMargin { get; set; }

        public double JuiceTurnover { get; set; }

        public double JuiceWinLoss { get; set; }

        public double LeftoverMarginTotal { get; set; }

        public double LeftoverMargin { get; set; }

        public double LeftoverTurnover { get; set; }

        public double LeftoverWinLoss { get; set; }

        public double Margin { get; set; }

        public double Turnover { get; set; }

        public double WinLoss { get; set; }

        public int EventProductCount { get; set; }
    }
}
