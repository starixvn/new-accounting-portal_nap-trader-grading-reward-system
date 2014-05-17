// --------------------------------------------------------------------------
// <copyright file="MatchPerformanceList.cs" company="Nexcel Solutions Vietnam">
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
    /// Match performance list view model.
    /// </summary>
    [Serializable]
    public class MatchPerformanceList
    {
        public MatchPerformanceList()
        {
            this.GroupList = new List<MatchPerformanceGroup>();
            this.GrandTotal = new MatchPerformanceItem();
        }

        public List<MatchPerformanceGroup> GroupList { get; set; }

        public MatchPerformanceItem GrandTotal { get; set; }

        /// <summary>
        /// Adds a group to the list.
        /// </summary>
        /// <param name="group">The group that needs to be added.</param>
        public void AddItem(MatchPerformanceGroup group)
        {
            if (group != null)
            {
                this.GroupList.Add(group);
                this.GrandTotal.Turnover += group.Total.Turnover;
                this.GrandTotal.WinLoss += group.Total.WinLoss;
                this.GrandTotal.BetCount += group.Total.BetCount;
                this.GrandTotal.Margin += group.Total.Margin;
            }
        }
    }
}