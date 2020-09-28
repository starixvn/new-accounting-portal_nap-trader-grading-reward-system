namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
    using System;

    [Serializable]
    public class TraderOfBettypeLeagueItem
    {
        public TraderOfBettypeLeagueItem() { }

        public TraderOfBettypeLeagueItem(TraderOfBettypeLeagueInfo data)
        {
            this.TraderId = data.TraderId;
            this.TraderName = data.TraderName;
            this.Grade = data.GradeId;
            this.TeamId = data.TeamId;
            this.TeamName = data.TeamName;
            this.NoOfMatches = data.MatchCount;
            this.Turnover = data.WinLoss;
            this.WinLoss = data.WinLoss;
            this.BetCount = data.BetCount;
            this.Margin = data.Margin;
            this.IsLive = data.IsLive;
        }

        public int TraderId { get; set; }

        public string TraderName { get; set; }

        public int Grade { get; set; }

        public int TeamId { get; set; }

        public string TeamName { get; set; }

        public int NoOfMatches { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal Margin { get; set; }

        public bool IsLive { get; set; }
    }
}
