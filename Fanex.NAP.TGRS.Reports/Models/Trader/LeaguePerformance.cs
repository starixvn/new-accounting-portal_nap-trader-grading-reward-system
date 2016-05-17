namespace Fanex.NAP.TGRS.Reports.Models.Trader
{
    public class LeaguePerformance
    {
        public int LeagueId { get; set; }

        public string LeagueName { get; set; }

        public decimal Turnover { get; set; }

        public decimal Winlost { get; set; }

        public decimal Margin { get; set; }
    }
}
