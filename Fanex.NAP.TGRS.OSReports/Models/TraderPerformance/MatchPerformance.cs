namespace Fanex.NAP.TGRS.OSReports.Models.TraderPerformance
{
    using Fanex.NAP.TGRS.Core.Helpers;
    using System;

    public class MatchPerformance
    {
        private DateTime eventDate;

        public int LeagueId { get; set; }

        public int MatchId { get; set; }

        public DateTime EventDate { set { eventDate = value; } }

        public int HomeId { get; set; }

        public int AwayId { get; set; }

        public string TeamName => $"{CacheRef.GetTeamName(HomeId)} - vs - {CacheRef.GetTeamName(AwayId)}";

        public string Date => eventDate.ToString("MM/dd/yyyy");

        public double Margin { get; set; }

        public double Turnover { get; set; }

        public double Winloss { get; set; }

        public double Point { get; set; }

        public int EventProductCount { get; set; }
    }
}