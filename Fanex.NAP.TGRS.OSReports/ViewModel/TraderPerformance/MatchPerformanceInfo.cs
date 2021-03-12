namespace Fanex.NAP.TGRS.OSReports.ViewModel.TraderPerformance
{
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.OSReports.Models.TraderPerformance;
    using System;

    public class MatchPerformanceInfo
    {
        public MatchPerformanceInfo() { }

        public MatchPerformanceInfo(MatchPerformance matchData)
        {
            this.LeagueId = matchData.LeagueId;
            this.MatchIds = matchData.MatchId.ToString();
            this.EventDate = matchData.EventDate;
            this.HomeId = matchData.HomeId;
            this.AwayId = matchData.AwayId;
            this.TeamName = $"{CacheRef.GetTeamName(HomeId)} - vs - {CacheRef.GetTeamName(AwayId)}";
            this.Date = matchData.EventDate.ToString("MM/dd/yyyy");
            this.Margin = matchData.Margin;
            this.Turnover = matchData.Turnover;
            this.Winloss = matchData.Winloss;
            this.Point = matchData.Point;
            this.EventProductCount = matchData.EventProductCount;
            this.BetCount = matchData.BetCount;
        }

        public int LeagueId { get; set; }

        public string MatchIds { get; set; }

        public DateTime EventDate { get; set; }

        public int HomeId { get; set; }

        public int AwayId { get; set; }

        public string TeamName { get; set; }

        public string Date { get; set; }

        public double Margin { get; set; }

        public double Turnover { get; set; }

        public double Winloss { get; set; }

        public double Point { get; set; }

        public int EventProductCount { get; set; }

        public int BetCount { get; set; }

        public static MatchPerformanceInfo operator +(MatchPerformanceInfo info1, MatchPerformanceInfo info2)
        {
            if (info1 == null)
            {
                return info2;
            }

            if (info2 == null)
            {
                return info1;
            }

            var sumInfo = new MatchPerformanceInfo
            {
                LeagueId = info1.LeagueId,
                MatchIds = info1.MatchIds + "," + info2.MatchIds,
                HomeId = info1.HomeId,
                AwayId = info1.AwayId,
                TeamName = info1.TeamName,
                Date = info1.Date,
                Point = info1.Point,
                EventProductCount = info1.EventProductCount + info2.EventProductCount,
                BetCount = info1.BetCount + info2.BetCount,
                Turnover = info1.Turnover,
                Winloss = info1.Winloss                
            };

            sumInfo.Margin = sumInfo.Turnover == 0 ? 0 : (sumInfo.Winloss / sumInfo.Turnover) * 100;

            return sumInfo;
        }
    }
}
