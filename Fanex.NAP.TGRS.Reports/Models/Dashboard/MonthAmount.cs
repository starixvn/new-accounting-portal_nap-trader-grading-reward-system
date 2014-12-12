// -----------------------------------------------------------------------
// <copyright file="MonthAmount.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.12.10">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Models.Dashboard
{
    using System;

    /// <summary>
    /// Monthly Amount.
    /// </summary>
    public class MonthAmount
    {
        public DateTime? EventDate { get; set; }

        public decimal Turnover { get; set; }

        public decimal Winlost { get; set; }

        public decimal Margin { get; set; }

        public int MatchCount { get; set; }
    }
}
