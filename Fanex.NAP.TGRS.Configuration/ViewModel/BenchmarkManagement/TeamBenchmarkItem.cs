// --------------------------------------------------------------------------
// <copyright file="TeamBenchmarkItem.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.ViewModel.BenchmarkManagement
{
    using System;
    using Fanex.Common;
    using Fanex.NAP.TGRS.Configuration.Models.BenchmarkManagement;

    /// <summary>
    /// Team benchmark view model.
    /// </summary>
    [Serializable]
    public class TeamBenchmarkItem
    {
        public TeamBenchmarkItem(TeamBenchmark benchmark)
        {
            if (benchmark != null)
            {
                this.TeamId = benchmark.TeamId;
                this.TeamName = benchmark.TeamName;
                this.Benchmark = Converter.ToDecimal(benchmark.Benchmark);
                this.Margin = Converter.ToDecimal(benchmark.Margin);
            }
        }

        public short TeamId { get; set; }

        public string TeamName { get; set; }

        public decimal Benchmark { get; set; }

        public decimal Margin { get; set; }
    }
}