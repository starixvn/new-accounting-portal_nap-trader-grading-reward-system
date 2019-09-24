// --------------------------------------------------------------------------
// <copyright file="BetTypePerformanceInfo.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.18">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Models.PerformanceDetail
{
    /// <summary>
    /// Bet type performance model.
    /// </summary>
    public class BetTypePerformanceInfo
    {
        public short? BetType { get; set; }

        public string TypeName { get; set; }

        public int? TraderCount { get; set; }

        public int? LeagueCount { get; set; }

        public int? MatchCount { get; set; }

        public decimal? Turnover { get; set; }

        public decimal? WinLoss { get; set; }

        public int? BetCount { get; set; }

        public decimal? Margin { get; set; }

        public bool IsLive { get; set; }
    }
}