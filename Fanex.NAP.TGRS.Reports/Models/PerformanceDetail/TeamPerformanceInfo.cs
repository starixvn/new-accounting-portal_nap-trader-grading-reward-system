// --------------------------------------------------------------------------
// <copyright file="TeamPerformanceInfo.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Models.PerformanceDetail
{
    /// <summary>
    /// Team performance model.
    /// </summary>
    public class TeamPerformanceInfo
    {
        public short? TeamId { get; set; }

        public string TeamName { get; set; }

        public decimal? TeamBenchmark { get; set; }

        public int? TraderCount { get; set; }

        public int? LeagueCount { get; set; }

        public int? MatchCount { get; set; }

        public decimal? Turnover { get; set; }

        public decimal? WinLoss { get; set; }
        
        public decimal? Margin { get; set; }

        public decimal? TurnoverReal { get; set; }

        public decimal? WinLossReal { get; set; }

        public decimal? MarginReal { get; set; }

        public int? BetCount { get; set; }

        public decimal? Score { get; set; }

        public bool IsLive { get; set; }
    }
}