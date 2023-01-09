namespace Fanex.NAP.TGRS.OSReports.Models.TraderPerformance
{
    public class BettypePerformanceInfo
    {
        public int BettypeId { get; set; }

        public int BetId { get; set; }

        public decimal Turnover { get; set; }

        public decimal VWinLoss { get; set; }

        public decimal? VMargin { get; set; }

        public decimal? AverageVTurnover { get; set; }

        public decimal? PointMargin { get; set; }

        public int BetCount { get; set; }
    }
}
