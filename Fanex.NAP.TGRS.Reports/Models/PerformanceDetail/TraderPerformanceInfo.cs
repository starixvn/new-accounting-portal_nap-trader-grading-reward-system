// --------------------------------------------------------------------------
// <copyright file="TraderPerformanceInfo.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.9">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Models.PerformanceDetail
{
    /// <summary>
    /// Trader performance model.
    /// </summary>
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

        public decimal? WinLoss { get; set; }

        public int? BetCount { get; set; }

        public decimal? Margin { get; set; }

        public int? NoOfTeamChanged { get; set; }

        public int? NoOfGradeChanged { get; set; }

        public decimal? Score { get; set; }

        public bool IsLive { get; set; }
    }
}