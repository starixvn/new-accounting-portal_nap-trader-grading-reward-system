// --------------------------------------------------------------------------
// <copyright file="TeamBenchmark.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Models.BenchmarkManagement
{
    /// <summary>
    /// Team benchmark model.
    /// </summary>
    public class TeamBenchmark
    {
        public short TeamId { get; set; }

        public string TeamName { get; set; }

        public decimal? Benchmark { get; set; }

        public decimal? Margin { get; set; }
    }
}