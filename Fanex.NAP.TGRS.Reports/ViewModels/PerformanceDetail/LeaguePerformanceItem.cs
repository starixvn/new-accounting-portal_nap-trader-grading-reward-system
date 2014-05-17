// --------------------------------------------------------------------------
// <copyright file="LeaguePerformanceItem.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.5.17">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail
{
    using System;

    /// <summary>
    /// League performance view model.
    /// </summary>
    [Serializable]
    public class LeaguePerformanceItem
    {
        public int LeagueId { get; set; }

        public string LeagueName { get; set; }

        public int NoOfTraders { get; set; }

        public int NoOfMatches { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal Margin { get; set; }

        public decimal LeagueBM { get; set; }
    }
}