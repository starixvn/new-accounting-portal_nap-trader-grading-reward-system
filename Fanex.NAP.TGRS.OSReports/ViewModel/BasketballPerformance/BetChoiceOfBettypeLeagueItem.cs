namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using Fanex.Common;
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;

    public class BetChoiceOfBettypeLeagueItem
    {
        public BetChoiceOfBettypeLeagueItem() { }

        public BetChoiceOfBettypeLeagueItem(BetChoiceOfBettypeLeagueInfo data)
        {
            this.BetChoice = data.BetChoice;
            this.IsLive = data.IsLive;
            this.NoOfMatches = Converter.ToInt(data.MatchCount);
            this.Turnover = Converter.ToDecimal(data.Turnover);
            this.WinLoss = Converter.ToDecimal(data.WinLoss);
            this.Margin = Converter.ToDecimal(data.Margin);
            this.BetCount = Converter.ToInt(data.BetCount);
            this.BetIdMappingCount = Converter.ToInt(data.BetIdMappingCount);
        }

        public string BetChoice { get; set; }

        public bool IsLive { get; set; }

        public int NoOfMatches { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal Margin { get; set; }

        public int BetCount { get; set; }

        public int BetIdMappingCount { get; set; }

    }
}
