namespace Fanex.NAP.TGRS.OSReports.Models.TraderReport
{
    public class Sport
    {
        public int SportId { get; set; }

        public string SportName { get; set; }

        public int NoOfLeague { get; set; }

        public int RegionCount { get; set; }

        public double Turnover { get; set; }

        public double VWinloss { get; set; }

        public double VMargin { get; set; }

        public double AverageVTurnover { get; set; }

        public double PointMargin { get; set; }
    }
}