using System;

namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    public class MatchOfLeaguePerformanceInfo
    {
        public int? MatchId { get; set; }

        public string MatchName { get; set; }

        public DateTime EventDate { get; set; }

        public int BetCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal Margin { get; set; }

        public decimal Turnover_AR { get; set; }

        public decimal WinLoss_AR { get; set; }

        public decimal Margin_AR { get; set; }
    }
}
