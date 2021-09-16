namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail
{
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using System;

    [Serializable]
    public class BetTypeBetChoiceItem
    {
        public BetTypeBetChoiceItem(BetTypeBetChoicePerformanceInfo info)
        {          
            this.BetChoice = info.BetChoice;
            this.LeagueCount = info.LeagueCount;
            this.MatchCount = info.MatchCount;
            this.BetCount = info.BetCount;
            this.Turnover = info.Turnover;
            this.WinLoss = info.WinLoss;
            this.Margin = info.Margin;
            this.TurnoverReal = info.TurnoverReal;
            this.WinLossReal = info.WinLossReal;
            this.MarginReal = info.MarginReal;
            this.IsLive = info.IsLive;
        }

        public string BetChoice { get; set; }

        public int LeagueCount { get; set; }

        public int MatchCount { get; set; }

        public int BetCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal? Margin { get; set; }

        public decimal TurnoverReal { get; set; }

        public decimal WinLossReal { get; set; }

        public decimal? MarginReal { get; set; }

        public bool IsLive { get; set; }
    }
}
