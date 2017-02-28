namespace Fanex.NAP.TGRS.OSReports.Models.Dashboard
{
    using System;

    public class DataByMonth
    {
        public int Month
        {
            get
            {
                return EventDate.Month;
            }
        }

        public int Year
        {
            get
            {
                return EventDate.Year;
            }
        }

        public decimal Turnover { get; set; }

        public decimal Winloss { get; set; }

        public int MatchCount { get; set; }

        public string RegionName { get; set; }

        public string TeamName { get; set; }

        public DateTime EventDate { get; set; }

        public decimal Margin
        {
            get
            {
                return decimal.Round(Turnover > 0 ? Winloss / Turnover : 0, 4);
            }
        }
    }
}
