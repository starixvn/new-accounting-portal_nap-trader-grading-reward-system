// --------------------------------------------------------------------------
// <copyright file="ProfitMarginItem.cs" company="Nexcel Solutions Vietnam">
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
    /// Profit margin view model.
    /// </summary>
    [Serializable]
    public class ProfitMarginItem
    {
        public ProfitMarginItem(ProfitMargin data)
        {
            if (data != null)
            {
                this.Year = Converter.ToInt(data.Year);
                this.Margin = Converter.ToDecimal(data.Margin);
            }
        }

        public int Year { get; set; }

        public decimal Margin { get; set; }
    }
}