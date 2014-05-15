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

    /// <summary>
    /// Team benchmark view model.
    /// </summary>
    [Serializable]
    public class TeamBenchmarkItem
    {
        public short TeamID { get; set; }

        public string TeamName { get; set; }

        public decimal Benchmark { get; set; }

        public decimal Margin { get; set; }
    }
}