namespace Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance
{
    using System;

    public class MatchOfBettypeTraderInfo
    {
        public int MatchId { get; set; }

        public int LeagueId { get; set; }

        public int LeagueGroupId { get; set; }

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
