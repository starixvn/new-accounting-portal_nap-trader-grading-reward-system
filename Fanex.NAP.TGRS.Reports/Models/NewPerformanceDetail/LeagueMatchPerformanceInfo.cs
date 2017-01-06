namespace Fanex.NAP.TGRS.Reports.Models.NewPerformanceDetail
{
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using System;

    public class LeagueMatchPerformanceInfo
    {
        public int MatchId { get; set; }

        public int HomeId { get; set; }

        public int AwayId { get; set; }

        public DateTime EventDate { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal Juice { get; set; }

        public int? BetCount { get; set; }

        public decimal Leftover
        {
            get
            {
                return WinLoss - Juice;
            }
        }

        public decimal? JuiceMargin
        {
            get
            {
                return Turnover != 0 ? ((decimal?)(Juice / Turnover * 100)) : null;
            }
        }

        public decimal? LeftoverMargin
        {
            get
            {
                return Margin - JuiceMargin;
            }
        }

        public decimal? Margin
        {
            get
            {
                return Turnover != 0 ? ((decimal?)(WinLoss / Turnover * 100)) : null;
            }
        }

        public string EventDateString
        {
            get
            {
                return Convert.ToDateTime(EventDate).ToShortFormatedDate();
            }
        }

        public string MatchName
        {
            get
            {
                return string.Format("{0} {1} {2}", CacheRef.GetTeamName(HomeId), ViewLang.Vs, CacheRef.GetTeamName(AwayId));
            }
        }
    }
}