namespace Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance
{
    public class BetChoiceOfBettypeLeagueInfo
    {
        public string BetChoice { get; set; }

        public bool IsLive { get; set; }        

        public int MatchCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal Margin { get; set; }

        public int BetCount { get; set; }

        public int BetIdMappingCount { get; set; }

    }
}