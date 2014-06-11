// --------------------------------------------------------------------------
// <copyright file="TraderPerformanceList.cs" company="Nexcel Solutions Vietnam">
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
    /// League performance list view model.
    /// </summary>
    [Serializable]
    public class TraderPerformanceList
    {
        public TraderPerformanceList()
        {
            this.ItemList = new List<TraderPerformanceItem>();
            this.Total = new TraderPerformanceItem();
        }

        public List<TraderPerformanceItem> ItemList { get; set; }

        public TraderPerformanceItem Total { get; set; }

        /// <summary>
        /// Adds an item to the group.
        /// </summary>
        /// <param name="item">The item that needs to be added.</param>
        public void AddItem(TraderPerformanceItem item)
        {
            if (item != null)
            {
                this.ItemList.Add(item);
                this.Total.NoOfLeagues += item.NoOfLeagues;
                this.Total.NoOfMatches += item.NoOfMatches;
                this.Total.Turnover += item.Turnover;
                this.Total.WinLoss += item.WinLoss;
                this.Total.BetCount += item.BetCount;
            }
        }
    }
}