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
    using System.Collections.Generic;
    using Fanex.Common;
    using Fanex.NAP.TGRS.Configuration.Models.BenchmarkManagement;

    /// <summary>
    /// Profit margin view model.
    /// </summary>
    [Serializable]
    public class ProfitMarginItem
    {
        public ProfitMarginItem()
        {
            ReportRows = new List<ProfitMarginItem>();
        }

        public ProfitMarginItem(ProfitMargin data)
        {
            if (data != null)
            {
                this.Year = Converter.ToInt(data.Year);
                this.Margin = Converter.ToDecimal(data.Margin);
            }
        }

        public int WorkShift { get; set; }

        public int Year { get; set; }

        public decimal WinLoss { get; set; }

        public decimal Stake { get; set; }

        public decimal Margin { get; set; }

        public List<ProfitMarginItem> ReportRows { get; set; }

        public void CalculateTotal(ProfitMarginItem item)
        {
            this.WinLoss += item.WinLoss;
            this.Stake += item.Stake;
        }

        public void CalculateMargin()
        {
            this.Margin = this.Stake == 0 ? 0 : (this.WinLoss / this.Stake) * 100;
        }
    }
}