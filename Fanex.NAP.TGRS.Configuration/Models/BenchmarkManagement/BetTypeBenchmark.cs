// --------------------------------------------------------------------------
// <copyright file="BetTypeBenchmark.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Models.BenchmarkManagement
{
    /// <summary>
    /// Bet type benchmark model.
    /// </summary>
    public class BetTypeBenchmark
    {
        public int BetType { get; set; }

        public string TypeName { get; set; }

        public decimal? Margin2 { get; set; }

        public decimal? Margin3 { get; set; }

        public decimal? Margin4 { get; set; }

        public decimal? BenchMarkShift1 { get; set; }

        public decimal? BenchMarkShift2 { get; set; }

        public decimal? BenchMarkShift3 { get; set; }
    }
}