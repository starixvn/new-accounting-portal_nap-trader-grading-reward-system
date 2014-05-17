// --------------------------------------------------------------------------
// <copyright file="GradePerformanceList.cs" company="Nexcel Solutions Vietnam">
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
    /// Grade performance list view model.
    /// </summary>
    [Serializable]
    public class GradePerformanceList
    {
        public GradePerformanceList()
        {
            this.ItemList = new List<GradePerformanceItem>();
            this.Total = new GradePerformanceItem();
        }

        public List<GradePerformanceItem> ItemList { get; set; }

        public GradePerformanceItem Total { get; set; }

        /// <summary>
        /// Adds an item to the group.
        /// </summary>
        /// <param name="item">The item that needs to be added.</param>
        public void AddItem(GradePerformanceItem item)
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