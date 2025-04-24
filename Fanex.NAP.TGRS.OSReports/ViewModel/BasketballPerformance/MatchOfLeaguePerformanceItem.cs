using Fanex.Common;
using System;

namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    [Serializable]
    public class MatchOfLeaguePerformanceItem
    {
        public MatchOfLeaguePerformanceItem() {}
        public MatchOfLeaguePerformanceItem(MatchOfLeaguePerformanceInfo matchData)
        {
            if (matchData?.MatchId == null) return;
            this.MatchId = matchData.MatchId.Value;
            this.MatchName = matchData.MatchName;
            this.EventDate = Converter.ToDateTime(matchData.EventDate).ToString("MM/dd/yyyy");
            this.BetCount = Converter.ToInt(matchData.BetCount);
            this.Turnover = Converter.ToDecimal(matchData.Turnover);
            this.WinLoss = Converter.ToDecimal(matchData.WinLoss);
            this.Margin = matchData.Margin;
            this.Turnover_AR = Converter.ToDecimal(matchData.Turnover_AR);
            this.WinLoss_AR = Converter.ToDecimal(matchData.WinLoss_AR);
            this.Margin_AR = matchData.Margin_AR;
        }

        public int? MatchId { get; set; }

        public string MatchName { get; set; }

        public string EventDate { get; set; }

        public int BetCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal Margin { get; set; }

        public decimal Turnover_AR { get; set; }

        public decimal WinLoss_AR { get; set; }

        public decimal Margin_AR { get; set; }
    }
}
