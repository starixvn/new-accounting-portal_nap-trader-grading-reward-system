namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
    using System;

    [Serializable]
    public class MatchOfBettypeLeagueTraderItem
    {
        public MatchOfBettypeLeagueTraderItem() { }

        public MatchOfBettypeLeagueTraderItem(MatchOfBettypeLeagueTraderInfo data)
        {
            this.MatchId = data.MatchId;
            this.HomeId = data.HomeId;
            this.AwayId = data.AwayId;
            this.EventDate = data.EventDate;
            this.IsLive = data.IsLive;
            this.Turnover = data.Turnover;
            this.WinLoss = data.WinLoss;
            this.BetCount = data.BetCount;
            this.Margin = data.Margin;
        }

        public int MatchId { get; set; }

        public int HomeId { get; set; }

        public int AwayId { get; set; }

        public DateTime EventDate { get; set; }

        public bool IsLive { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal Margin { get; set; }

    }
}
