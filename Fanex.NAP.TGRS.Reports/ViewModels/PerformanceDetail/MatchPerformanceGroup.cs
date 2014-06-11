// --------------------------------------------------------------------------
// <copyright file="MatchPerformanceGroup.cs" company="Nexcel Solutions Vietnam">
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
    /// Match performance group view model.
    /// </summary>
    [Serializable]
    public class MatchPerformanceGroup
    {
        public MatchPerformanceGroup()
        {
            this.ItemList = new List<MatchPerformanceItem>();
            this.Total = new MatchPerformanceItem();
        }

        public MatchPerformanceGroup(int leagueId, string leagueName)
            : this()
        {
            this.LeagueId = leagueId;
            this.LeagueName = leagueName;
        }

        public int LeagueId { get; set; }

        public string LeagueName { get; set; }

        public List<MatchPerformanceItem> ItemList { get; set; }

        public MatchPerformanceItem Total { get; set; }

        /// <summary>
        /// Adds an item to the group.
        /// </summary>
        /// <param name="item">The item that needs to be added.</param>
        public void AddItem(MatchPerformanceItem item)
        {
            if (item != null)
            {
                this.ItemList.Add(item);
                this.Total.Turnover += item.Turnover;
                this.Total.WinLoss += item.WinLoss;
                this.Total.BetCount += item.BetCount;
            }
        }
    }
}