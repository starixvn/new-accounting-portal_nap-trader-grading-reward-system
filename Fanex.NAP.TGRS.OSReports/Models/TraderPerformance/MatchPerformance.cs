namespace Fanex.NAP.TGRS.OSReports.Models.TraderPerformance
{
    using System;

    public class MatchPerformance
    {
        public int LeagueId { get; set; }

        public int MatchId { get; set; }        

        public DateTime EventDate { get; set; }

        public int HomeId { get; set; }

        public int AwayId { get; set; }
     
        public int ParentID { get; set; }

        public int ChildMatchType { get; set; }

        public double Margin { get; set; }

        public double Turnover { get; set; }

        public double Winloss { get; set; }

        public double Point { get; set; }

        public int EventProductCount { get; set; }

        public int BetCount { get; set; }
    }
}