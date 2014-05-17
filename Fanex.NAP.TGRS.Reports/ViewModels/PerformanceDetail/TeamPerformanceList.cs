// --------------------------------------------------------------------------
// <copyright file="TeamPerformanceList.cs" company="Nexcel Solutions Vietnam">
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
    public class TeamPerformanceList
    {
        public TeamPerformanceList()
        {
            this.ItemList = new List<TeamPerformanceItem>();
            this.Total = new TeamPerformanceItem();
        }

        public List<TeamPerformanceItem> ItemList { get; set; }

        public TeamPerformanceItem Total { get; set; }

        /// <summary>
        /// Adds an item to the group.
        /// </summary>
        /// <param name="item">The item that needs to be added.</param>
        public void AddItem(TeamPerformanceItem item)
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
                this.Total.TeamBM += item.TeamBM;
            }
        }
    }
}