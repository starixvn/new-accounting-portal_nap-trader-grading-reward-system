// --------------------------------------------------------------------------
// <copyright file="LeaguePerformanceInfo.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.9">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Models.PerformanceDetail
{
    /// <summary>
    /// League performance model.
    /// </summary>
    public class LeaguePerformanceInfo
    {
        public int? LeagueId { get; set; }

        public string LeagueName { get; set; }

        public decimal? LeagueBenchmark { get; set; }

        public decimal? BetTypeBenchmark { get; set; }

        public int? TraderCount { get; set; }

        public int? MatchCount { get; set; }

        public decimal? Turnover { get; set; }

        public decimal? WinLoss { get; set; }

        public int? BetCount { get; set; }

        public decimal? Margin { get; set; }
    }
}