// --------------------------------------------------------------------------
// <copyright file="LeagueBenchmarkItem.cs" company="Nexcel Solutions Vietnam">
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
    /// League benchmark view model.
    /// </summary>
    [Serializable]
    public class LeagueBenchmarkItem
    {
        public LeagueBenchmarkItem(LeagueBenchmark rawData)
        {
            if (rawData != null)
            {
                this.LeagueId = rawData.LeagueId;
                this.LeagueName = rawData.LeagueName;
                this.Margin = Converter.ToDecimal(Margin);
                this.Benchmark = Converter.ToDecimal(rawData.Benchmark);
            }
        }

        public int LeagueId { get; set; }

        public string LeagueName { get; set; }

        public decimal Benchmark { get; set; }

        public decimal Margin { get; set; }
    }
}