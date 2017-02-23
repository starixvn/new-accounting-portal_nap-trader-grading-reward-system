namespace Fanex.NAP.TGRS.OSReports.Models.Dashboard
{
    using System;

    public class DataByMonth
    {
        public int Month { get; set; }

        public int Year { get; set; }

        public decimal Turnover { get; set; }

        public decimal Winloss { get; set; }

        public int MatchCount { get; set; }

        public string RegionName { get; set; }

        public string TeamName { get; set; }

        public DateTime MonthYear
        {
            get
            {
                if (Year > 0 && Month > 0)
                {
                    return new DateTime(Year, Month, 1);
                }
                else
                {
                    return DateTime.Now;
                }
            }
        }

        public decimal Margin
        {
            get
            {
                return decimal.Round(Turnover > 0 ? Winloss / Turnover : 0, 4);
            }
        }
    }
}
