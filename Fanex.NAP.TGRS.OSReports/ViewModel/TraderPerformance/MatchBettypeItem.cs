namespace Fanex.NAP.TGRS.OSReports.ViewModel.TraderPerformance
{
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.OSReports.Models.TraderPerformance;
    using System;

    [Serializable]
    public class MatchBettypeItem
    {
        public MatchBettypeItem(MatchBettypeInfo data)
        {
            this.BettypeId = data.BettypeId;
            this.BettypeName = CacheRef.GetQuarter(data.BettypeId, data.BetId);
            this.BetId = data.BetId;
            this.Turnover = data.Turnover;
            this.VWinloss = data.VWinloss;
            this.Margin = data.Margin;
            this.BetCount = data.BetCount;
        }

        public int BettypeId { get; set; }

        public int BetId { get; set; }

        public string BettypeName { get; set; }

        public decimal Turnover { get; set; }

        public decimal VWinloss { get; set; }

        public decimal Margin { get; set; }

        public int BetCount { get; set; }
    }
}
