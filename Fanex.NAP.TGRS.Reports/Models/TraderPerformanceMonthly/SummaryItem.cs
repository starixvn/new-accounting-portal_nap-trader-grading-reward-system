namespace Fanex.NAP.TGRS.Reports.Models.TraderPerformanceMonthly
{
    using System.Collections.Generic;

    public class SummaryItem
    {
        public Trader Trader { get; set; }

        public AvgSummary FstHalf { get; set; }

        public AvgSummary SndHalf { get; set; }

        public AvgSummary CurrentYear { get; set; }

        public AvgSummary LastYear { get; set; }

        public Dictionary<int, Summary> Months { get; set; }

        public SummaryItem WithYears(IEnumerable<YearSummary> years, int reportYear)
        {
            var currentYear = reportYear;

            foreach (var year in years)
            {
                if (year.Year == currentYear)
                {
                    CurrentYear = AvgSummary.Cast(year);
                }

                if (year.Year + 1 == currentYear)
                {
                    LastYear = AvgSummary.Cast( year);
                }
            }

            return this;
        }

        public SummaryItem WithMonths(IEnumerable<MonthSummary> months)
        {
            Months = new Dictionary<int, Summary>();

            foreach (var month in months)
            {
                if (!Months.ContainsKey(month.Month))
                {
                    Months.Add(month.Month, month);
                }
            }

            return this;
        }

        public static SummaryItem operator +(SummaryItem s1, SummaryItem s2)
        {
            if (s1 == null) return s2;

            if (s2 == null) return s1;

            var months = s1.Months == null ? new Dictionary<int, Summary>() : new Dictionary<int, Summary>(s1.Months);

            foreach (var item in s2.Months)
            {
                if (months.ContainsKey(item.Key))
                {
                    months[item.Key] += item.Value;
                }
                else
                {
                    months.Add(item.Key, item.Value);
                }
            }

            return new SummaryItem
            {
                FstHalf = s1.FstHalf + s2.FstHalf,
                SndHalf = s1.SndHalf + s2.SndHalf,
                CurrentYear = s1.CurrentYear + s2.CurrentYear,
                LastYear = s1.LastYear + s2.LastYear,
                Months = months
            };
        }
    }
}