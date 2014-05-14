// --------------------------------------------------------------------------
// <copyright file="BetTypeBenchmarkItem.cs" company="Nexcel Solutions Vietnam">
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
    /// Bet type benchmark view model.
    /// </summary>
    [Serializable]
    public class BetTypeBenchmarkItem
    {
        public int BetTypeID { get; set; }

        public string BetTypeName { get; set; }

        public decimal BenchMark { get; set; }

        public decimal Margin { get; set; }
    }
}