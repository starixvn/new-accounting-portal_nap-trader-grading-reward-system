// -----------------------------------------------------------------------
// <copyright file="TeamPerformance.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.26">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Models.PerformanceSummary
{
    using System;

    /// <summary>
    /// Summary Report Team Performance model.
    /// </summary>
    public class TeamPerformance
    {
        public int TeamId { get; set; }

        public string TeamName { get; set; }

        public decimal Turnover { get; set; }

        public decimal Winlost { get; set; }

        public decimal Margin { get; set; }

        public decimal Match { get; set; }
    }
}
