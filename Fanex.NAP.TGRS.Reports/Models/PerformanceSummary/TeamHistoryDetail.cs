// -----------------------------------------------------------------------
// <copyright file="TeamHistoryDetail.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.6.2">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Models.PerformanceSummary
{
    using System;
    using System.Data;

    /// <summary>
    /// TeamHistoryDetail model.
    /// </summary>
    public class TeamHistoryDetail
    {
        public int CustId { get; set; }

        public int TeamId { get; set; }

        public string TeamName { get; set; }

        public DateTime TeamEffectiveDate { get; set; }

        public int MatchCount { get; set; }

        public int BetCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLost { get; set; }

        public decimal? Margin { get; set; }
    }
}
