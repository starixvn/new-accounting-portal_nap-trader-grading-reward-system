// --------------------------------------------------------------------------
// <copyright file="ProfitMargin.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Models.BenchmarkManagement
{
    /// <summary>
    /// Profit margin model.
    /// </summary>
    public class ProfitMargin
    {
        public int? Year { get; set; }

        public decimal? Margin { get; set; }
    }
}