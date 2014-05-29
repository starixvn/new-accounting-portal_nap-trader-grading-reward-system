// -----------------------------------------------------------------------
// <copyright file="TraderPerformance.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.26">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Models.PerformanceSummary
{
    using System;
    using System.Data;

    /// <summary>
    /// Summary Report Trader Performance information model.
    /// </summary>
    public class TraderPerformance
    {
        public TraderPerformance()
        {
            this.TopMinMargin = 0;
            this.TopMaxMargin = 0;
            this.BottomMinMargin = 0;
            this.BottomMaxMargin = 0;
        }

        public TraderPerformance(DataRow topTraderRow, DataRow bottomTraderRow)
        {
            this.TopMinMargin = Convert.ToDecimal(topTraderRow["TopMinMargin"]);
            this.TopMaxMargin = Convert.ToDecimal(topTraderRow["TopMaxMargin"]);
            this.BottomMinMargin = Convert.ToDecimal(bottomTraderRow["BottomMinMargin"]);
            this.BottomMaxMargin = Convert.ToDecimal(bottomTraderRow["BottomMaxMargin"]);
        }

        public decimal TopMinMargin { get; set; }

        public decimal TopMaxMargin { get; set; }

        public decimal BottomMinMargin { get; set; }

        public decimal BottomMaxMargin { get; set; }
    }
}
