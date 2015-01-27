// --------------------------------------------------------------------------
// <copyright file="UpdatingLeagueBenchmarkForm.cs" company="Nexcel Solutions Vietnam">
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
    /// The view model contains the data that are needed for updating benchmark and getting the updated list.
    /// </summary>
    [Serializable]
    public class UpdatingLeagueBenchmarkForm
    {
        public int LeagueId { get; set; }

        public decimal Benchmark { get; set; }

        public short SportType { get; set; }

        public byte DisplayMode { get; set; }

        public string ProgramId { get; set; }

        public string CountryCode { get; set; }

        public string LeagueName { get; set; }

        public int AllMarket { get; set; }
    }
}