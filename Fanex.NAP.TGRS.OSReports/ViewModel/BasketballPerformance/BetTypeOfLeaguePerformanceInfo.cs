namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    public class BetTypeOfLeaguePerformanceInfo
    {
        public int? BetTypeId { get; set; }

        public string BetTypeName { get; set; }

        public int BetCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal Margin { get; set; }

        public decimal Turnover_AR { get; set; }

        public decimal WinLoss_AR { get; set; }

        public decimal Margin_AR { get; set; }
    }
}
