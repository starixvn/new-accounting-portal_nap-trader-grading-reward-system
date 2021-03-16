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
            this.ChildMatchType = matchData.ChildMatchType;
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

        public int ChildMatchType { get; set; }

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

            var parentMatchInfo = info1.ChildMatchType == 0 ? info1 : info2;

            var sumInfo = new MatchPerformanceInfo
            {
                LeagueId = parentMatchInfo.LeagueId,
                MatchIds = info1.MatchIds + "," + info2.MatchIds,
                HomeId = parentMatchInfo.HomeId,
                AwayId = parentMatchInfo.AwayId,
                TeamName = parentMatchInfo.TeamName,
                Date = parentMatchInfo.Date,
                ChildMatchType = parentMatchInfo.ChildMatchType,
                Point = info1.Point + info2.Point,
                EventProductCount = info1.EventProductCount + info2.EventProductCount,
                BetCount = info1.BetCount + info2.BetCount,
                Turnover = info1.Turnover + info2.Turnover,
                Winloss = info1.Winloss + info2.Winloss
            };            

            sumInfo.Margin = sumInfo.Turnover == 0 ? 0 : (sumInfo.Winloss / sumInfo.Turnover) * 100;

            return sumInfo;
        }
    }
}
