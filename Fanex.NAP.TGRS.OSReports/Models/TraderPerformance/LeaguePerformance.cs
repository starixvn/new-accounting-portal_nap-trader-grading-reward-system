namespace Fanex.NAP.TGRS.OSReports.Models.TraderPerformance
{
    public class LeaguePerformance
    {
        public int LeagueId { get; set; }

        public string LeagueName { get; set; }

        public int NoOfBettype { get; set; }

        public decimal Turnover { get; set; }

        public decimal VWinLoss { get; set; }

        public decimal? VMargin { get; set; }

        public decimal? AverageVTurnover { get; set; }

        public decimal? PointMargin { get; set; }
    }
}
