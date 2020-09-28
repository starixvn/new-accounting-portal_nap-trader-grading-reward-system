namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using Fanex.Common;
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
    using System;

    [Serializable]
    public class TraderOfBettypeItem
    {
        public TraderOfBettypeItem() { }

        public TraderOfBettypeItem(TraderOfBettypeInfo data)
        {
            this.TraderId = data.TraderId;
            this.TraderName = data.TraderName;
            this.Grade = data.GradeId;
            this.TeamId = data.TeamId;
            this.TeamName = data.TeamName;
            this.NoOfLeagues = Converter.ToInt(data.LeagueCount);
            this.NoOfMatches = Converter.ToInt(data.MatchCount);
            this.Turnover = Converter.ToDecimal(data.Turnover);
            this.WinLoss = Converter.ToDecimal(data.WinLoss);
            this.Margin = data.Margin;
            this.BetCount = Converter.ToInt(data.BetCount);
            this.IsLive = data.IsLive;
        }

        public int TraderId { get; set; }

        public string TraderName { get; set; }

        public int Grade { get; set; }

        public int TeamId { get; set; }

        public string TeamName { get; set; }

        public int NoOfLeagues { get; set; }

        public int NoOfMatches { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal Margin { get; set; }

        public bool IsLive { get; set; }
    }
}
