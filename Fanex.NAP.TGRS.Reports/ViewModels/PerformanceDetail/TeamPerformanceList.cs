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
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
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
            this.ItemLiveList = new List<TeamPerformanceItem>();
            this.ItemNonLiveList = new List<TeamPerformanceItem>();
            this.Total = new TeamPerformanceItem();
        }

        public List<TeamPerformanceItem> ItemLiveList { get; set; }

        public List<TeamPerformanceItem> ItemNonLiveList { get; set; }

        public TeamPerformanceItem Total { get; set; }

        public void AddTeamList(IEnumerable<TeamPerformanceInfo> teamPerformanceInfos, bool isLive)
        {
            foreach (var item in teamPerformanceInfos)
            {
                if (item != null)
                {
                    this.AddItem(new TeamPerformanceItem(item), isLive);
                }
            }
        }

        /// <summary>
        /// Adds an item to the group.
        /// </summary>
        /// <param name="item">The item that needs to be added.</param>
        private void AddItem(TeamPerformanceItem item, bool isLive)
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

        private void CalculateTotal(TeamPerformanceItem item)
        {
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