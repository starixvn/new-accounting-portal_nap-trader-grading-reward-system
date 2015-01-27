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
                this.BenchMarkShift1 = rawData.BenchMarkShift1;
                this.BenchMarkShift2 = rawData.BenchMarkShift2;
                this.BenchMarkShift3 = rawData.BenchMarkShift3;
                this.Margin2 = rawData.Margin2;
                this.Margin3 = rawData.Margin3;
                this.Margin4 = rawData.Margin4;
            }
        }

        public int BetTypeId { get; set; }

        public string BetTypeName { get; set; }

        public decimal? BenchMarkShift1 { get; set; }

        public decimal? BenchMarkShift2 { get; set; }

        public decimal? BenchMarkShift3 { get; set; }

        public decimal? Margin2 { get; set; }

        public decimal? Margin3 { get; set; }

        public decimal? Margin4 { get; set; }
    }
}