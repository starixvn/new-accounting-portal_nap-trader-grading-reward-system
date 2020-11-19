namespace Fanex.NAP.TGRS.OSReports.Models.Dashboard
{
    public class BasketballLeagueGroupSummaryInfo
    {
        public int LeagueGroupId { get; set; }

        public string GroupName { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal Margin { get; set; }
    }
}
