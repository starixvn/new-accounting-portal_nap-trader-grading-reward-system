// --------------------------------------------------------------------------
// <copyright file="LeagueBenchmark.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Models.BenchmarkManagement
{
    /// <summary>
    /// League benchmark model.
    /// </summary>
    public class LeagueBenchmark
    {
        public int LeagueID { get; set; }

        public string LeagueName { get; set; }

        public decimal? BenchMark { get; set; }

        public decimal? Margin { get; set; }
    }
}