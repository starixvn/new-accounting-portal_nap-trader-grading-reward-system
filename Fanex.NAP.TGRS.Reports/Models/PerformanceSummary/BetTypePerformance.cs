namespace Fanex.NAP.TGRS.Reports.Models.PerformanceSummary
{
    public class BetTypePerformance
    {
        public int BetType { get; set; }

        public string TypeName { get; set; }

        public decimal Turnover { get; set; }

        public decimal Winlost { get; set; }

        public decimal? Margin { get; set; }
    }
}
