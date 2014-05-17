// --------------------------------------------------------------------------
// <copyright file="BetTypePerformanceList.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.5.17">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail
{
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// Bet type performance list view model.
    /// </summary>
    [Serializable]
    public class BetTypePerformanceList
    {
        public BetTypePerformanceList()
        {
            this.ItemList = new List<BetTypePerformanceItem>();
            this.Total = new BetTypePerformanceItem();
        }

        public List<BetTypePerformanceItem> ItemList { get; set; }

        public BetTypePerformanceItem Total { get; set; }

        /// <summary>
        /// Adds an item to the group.
        /// </summary>
        /// <param name="item">The item that needs to be added.</param>
        public void AddItem(BetTypePerformanceItem item)
        {
            if (item != null)
            {
                this.ItemList.Add(item);
                this.Total.NoOfTraders += item.NoOfTraders;
                this.Total.NoOfLeagues += item.NoOfLeagues;
                this.Total.NoOfMatches += item.NoOfMatches;
                this.Total.Turnover += item.Turnover;
                this.Total.WinLoss += item.WinLoss;
                this.Total.BetCount += item.BetCount;
                this.Total.Margin += item.Margin;
            }
        }
    }
}