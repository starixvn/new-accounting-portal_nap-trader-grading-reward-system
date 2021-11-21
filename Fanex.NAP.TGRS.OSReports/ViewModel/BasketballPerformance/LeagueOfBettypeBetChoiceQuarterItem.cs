namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using Fanex.Common;
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
    using System;

    [Serializable]
    public class LeagueOfBettypeBetChoiceQuarterItem
    {
        public LeagueOfBettypeBetChoiceQuarterItem()
        { }

        public LeagueOfBettypeBetChoiceQuarterItem(LeagueOfBettypeBetChoiceQuarterInfo data)
        {
            this.LeagueId = data.LeagueId;
            this.LeagueName = data.LeagueName;
            this.LeagueGroupId = data.LeagueGroupID;
            this.LeagueGroupName = string.Empty;
            this.IsLive = data.IsLive;            
            this.NoOfMatches = Converter.ToInt(data.MatchCount);
            this.Turnover = Converter.ToDecimal(data.Turnover);
            this.WinLoss = Converter.ToDecimal(data.WinLoss);
            this.Margin = Converter.ToDecimal(data.Margin);
            this.BetCount = Converter.ToInt(data.BetCount);
        }

        public int LeagueId { get; set; }

        public string LeagueName { get; set; }

        public int LeagueGroupId { get; set; }

        public string LeagueGroupName { get; set; }

        public bool IsLive { get; set; }

        public int NoOfMatches { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal Margin { get; set; }

    }
}
