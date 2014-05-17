// --------------------------------------------------------------------------
// <copyright file="LeaguePerformanceList.cs" company="Nexcel Solutions Vietnam">
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
    public class LeaguePerformanceList
    {
        public LeaguePerformanceList()
        {
            this.ItemList = new List<LeaguePerformanceItem>();
            this.Total = new LeaguePerformanceItem();
        }

        public List<LeaguePerformanceItem> ItemList { get; set; }

        public LeaguePerformanceItem Total { get; set; }

        /// <summary>
        /// Adds an item to the group.
        /// </summary>
        /// <param name="item">The item that needs to be added.</param>
        public void AddItem(LeaguePerformanceItem item)
        {
            if (item != null)
            {
                this.ItemList.Add(item);
                this.Total.NoOfTraders += item.NoOfTraders;
                this.Total.NoOfMatches += item.NoOfMatches;
                this.Total.Turnover += item.Turnover;
                this.Total.WinLoss += item.WinLoss;
                this.Total.BetCount += item.BetCount;
                this.Total.Margin += item.Margin;
                this.Total.LeagueBM += item.LeagueBM;
            }
        }
    }
}