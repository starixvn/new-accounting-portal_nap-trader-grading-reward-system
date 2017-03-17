namespace Fanex.NAP.TGRS.Reports.Models.NewPerformanceDetail
{
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using System;

    public class TeamLeagueTraderMatchPerformanceInfo
    {
        public int MatchId { get; set; }

        public int HomeId { get; set; }

        public int AwayId { get; set; }

        public DateTime EventDate { get; set; }

        public decimal Turnover { get; set; }

        public decimal TurnoverLeftover { get; set; }

        public decimal? TurnoverJuice
        {
            get
            {
                return (Turnover - TurnoverLeftover);
            }
        }

        public decimal WinLoss { get; set; }

        public decimal WinlostLeftover { get; set; }

        public int? BetCount { get; set; }

        public decimal Juice
        {
            get
            {
                return WinLoss - WinlostLeftover;
            }
        }

        public decimal? JuiceMargin
        {
            get
            {
                return TurnoverJuice != 0 ? ((decimal?)(Juice / TurnoverJuice * 100)) : null;
            }
        }

        public decimal? JuiceMarginTotal
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
                return TurnoverLeftover != 0 ? ((decimal?)(WinlostLeftover / TurnoverLeftover * 100)) : null;
            }
        }

        public decimal? LeftoverMarginTotal
        {
            get
            {
                return Turnover != 0 ? ((decimal?)(WinlostLeftover / Turnover * 100)) : null;
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