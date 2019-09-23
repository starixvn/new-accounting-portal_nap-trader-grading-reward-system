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
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
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
            this.ItemLiveList = new List<LeaguePerformanceItem>();
            this.ItemNonLiveList = new List<LeaguePerformanceItem>();
            this.Total = new LeaguePerformanceItem();
        }

        public List<LeaguePerformanceItem> ItemLiveList { get; set; }

        public List<LeaguePerformanceItem> ItemNonLiveList { get; set; }

        public LeaguePerformanceItem Total { get; set; }

        public void AddLeagueList(IEnumerable<LeaguePerformanceInfo> leaguePerformanceInfos, bool isLive)
        {
            foreach (var item in leaguePerformanceInfos)
            {
                if (item != null)
                {
                    this.AddItem(new LeaguePerformanceItem(item), isLive);
                }
            }
        }

        /// <summary>
        /// Adds an item to the group.
        /// </summary>
        /// <param name="item">The item that needs to be added.</param>
        private void AddItem(LeaguePerformanceItem item, bool isLive)
        {
            if (isLive)
            {
                this.ItemLiveList.Add(item);
            }
            else
            {
                this.ItemNonLiveList.Add(item);
            }

            CalculateTotal(item);
        }

        private void CalculateTotal(LeaguePerformanceItem item)
        {
            this.Total.NoOfTraders += item.NoOfTraders;
            this.Total.NoOfMatches += item.NoOfMatches;
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.BetCount += item.BetCount;
        }
    }
}