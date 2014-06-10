// --------------------------------------------------------------------------
// <copyright file="MatchPerformanceInfo.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.9">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Models.PerformanceDetail
{
    using System;

    /// <summary>
    /// Match performance model.
    /// </summary>
    public class MatchPerformanceInfo
    {
        public int? MatchId { get; set; }

        public int? HomeId { get; set; }

        public int? AwayId { get; set; }

        public DateTime? EventDate { get; set; }

        public decimal? Turnover { get; set; }

        public decimal? WinLoss { get; set; }

        public int? BetCount { get; set; }

        public decimal? Margin { get; set; }
    }
}