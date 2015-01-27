// --------------------------------------------------------------------------
// <copyright file="GradePerformanceInfo.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.13">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Models.PerformanceDetail
{
    /// <summary>
    /// Grade performance model.
    /// </summary>
    public class GradePerformanceInfo
    {
        public byte? Grade { get; set; }

        public int? TraderCount { get; set; }

        public int? LeagueCount { get; set; }

        public int? MatchCount { get; set; }

        public decimal? Turnover { get; set; }

        public decimal? WinLoss { get; set; }

        public int? BetCount { get; set; }

        public decimal? Margin { get; set; }

        public decimal? Score { get; set; }
    }
}