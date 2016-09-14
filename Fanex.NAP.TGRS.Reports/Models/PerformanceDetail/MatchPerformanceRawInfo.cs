// --------------------------------------------------------------------------
// <copyright file="MatchPerformanceRawInfo.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2016.10.9">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Models.PerformanceDetail
{
    using System;

    /// <summary>
    /// Match performance model.
    /// </summary>
    public class MatchPerformanceRawInfo
    {
        public int? LeagueId { get; set; }

        public int? MatchId { get; set; }

        public int? HomeId { get; set; }

        public int? AwayId { get; set; }

        public DateTime? EventDate { get; set; }

        public decimal? Turnover { get; set; }

        public decimal? WinLoss { get; set; }

        public decimal? WinLossScore { get; set; }

        public int? BetCount { get; set; }

        public decimal? Margin { get; set; }

        public decimal? SumCategory { get; set; }
    }
}