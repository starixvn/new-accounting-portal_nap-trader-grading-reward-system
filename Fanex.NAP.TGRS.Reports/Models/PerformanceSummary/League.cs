// -----------------------------------------------------------------------
// <copyright file="League.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.26">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Models.PerformanceSummary
{
    /// <summary>
    /// Summary Report League information model.
    /// </summary>
    public class League
    {
        public int LeagueId { get; set; }

        public string LeagueName { get; set; }

        public decimal Turnover { get; set; }

        public decimal Winloss { get; set; }

        public decimal? Margin { get; set; }
    }
}
