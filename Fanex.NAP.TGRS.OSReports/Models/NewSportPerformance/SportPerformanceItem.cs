namespace Fanex.NAP.TGRS.OSReports.Models.NewSportPerformance
{
    public class SportPerformanceItem
    {
        public int SportId { get; set; }

        public string SportName { get; set; }

        public int NoOfLeague { get; set; }

        public int RegionCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal VWinLoss { get; set; }

        public decimal? VMargin { get; set; }

        public decimal JuiceTurnover { get; set; }

        public decimal JuiceWinLoss { get; set; }

        public decimal? JuiceMargin { get; set; }

        public decimal LeftoverTurnover { get; set; }

        public decimal LeftoverWinLoss { get; set; }

        public decimal? LeftoverMargin { get; set; }

        public decimal? JuiceMarginTotal { get; set; }

        public decimal? LeftoverMarginTotal { get; set; }

        public decimal? AverageVTurnover { get; set; }

        public decimal? PointMargin { get; set; }
    }
}
