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
    using Fanex.Common;
    using Fanex.NAP.TGRS.Configuration.Models.BenchmarkManagement;

    /// <summary>
    /// Bet type benchmark view model.
    /// </summary>
    [Serializable]
    public class BetTypeBenchmarkItem
    {
        public BetTypeBenchmarkItem(BetTypeBenchmark rawData)
        {
            if (rawData != null)
            {
                this.BetTypeId = rawData.BetType;
                this.BetTypeName = rawData.TypeName;
                this.Benchmark = Converter.ToDecimal(rawData.Benchmark);
                this.Margin = Converter.ToDecimal(rawData.Margin);
            }
        }

        public int BetTypeId { get; set; }

        public string BetTypeName { get; set; }

        public decimal Benchmark { get; set; }

        public decimal Margin { get; set; }
    }
}