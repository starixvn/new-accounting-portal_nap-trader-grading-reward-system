namespace Fanex.NAP.TGRS.OSReports.Models.TraderPerformance
{
    public class BettypePerformance
    {
        public string BettypeName { get; set; }

        public decimal Turnover { get; set; }

        public decimal VWinLoss { get; set; }

        public decimal? VMargin { get; set; }

        public decimal? AverageVTurnover { get; set; }

        public decimal? PointMargin { get; set; }
    }
}
