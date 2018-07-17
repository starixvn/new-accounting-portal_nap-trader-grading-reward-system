namespace Fanex.NAP.TGRS.OSReports.Models.TraderPerformance
{
    using RemotingRef;
    using System;

    public class MatchPerformance
    {
        private DateTime eventDate;

        public int LeagueId { get; set; }

        public int MatchId { get; set; }

        public DateTime EventDate { set { eventDate = value; } }

        public int HomeId { get; set; }

        public int AwayId { get; set; }

        public string TeamName => $"{RefData.GetTeamName(HomeId.ToString(), "en")} - vs - {RefData.GetTeamName(AwayId.ToString(), "en")}";

        public string Date => eventDate.ToString("MM/dd/yyyy");

        public double Margin { get; set; }

        public double Turnover { get; set; }

        public double Winloss { get; set; }

        public double Point { get; set; }

        public int EventProductCount { get; set; }
    }
}