namespace Fanex.NAP.TGRS.OSReports.Models.NewSportPerformance
{
    public class RegionPerformanceItem
    {
        public string RegionName { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal? Margin { get; set; }

        public decimal JuiceTurnover { get; set; }

        public decimal JuiceWinLoss { get; set; }

        public decimal? JuiceMargin { get; set; }

        public decimal LeftoverTurnover { get; set; }

        public decimal LeftoverWinLoss { get; set; }

        public decimal? LeftoverMargin { get; set; }

        public decimal? JuiceMarginTotal { get; set; }

        public decimal? LeftoverMarginTotal { get; set; }

        public int EventProductCount { get; set; }
    }
}
