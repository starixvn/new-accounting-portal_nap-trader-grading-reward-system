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
        public int BetTypeID { get; set; }

        public string BetTypeName { get; set; }

        public decimal? BenchMark { get; set; }

        public decimal? Margin { get; set; }
    }
}