namespace Fanex.NAP.TGRS.Reports.Models.NewPerformanceDetail
{
    using System;

    [Serializable]
    public class TraderPerformanceInfo
    {
        public int? CustId { get; set; }

        public string Username { get; set; }

        public byte? Grade { get; set; }

        public short? TeamId { get; set; }

        public string TeamName { get; set; }

        public int? LeagueCount { get; set; }

        public int? MatchCount { get; set; }

        public decimal? Turnover { get; set; }

        public decimal? Juice { get; set; }

        public decimal? WinLoss { get; set; }

        public int? BetCount { get; set; }

        public decimal? Margin { get; set; }

        public int? NoOfTeamChanged { get; set; }

        public int? NoOfGradeChanged { get; set; }

        public decimal? Score { get; set; }

        public decimal? Leftover
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
    }
}