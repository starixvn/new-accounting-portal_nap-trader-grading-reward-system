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
            this.ItemByOrderList = new List<LeaguePerformanceItem>();
            this.ItemLiveList = new List<LeaguePerformanceItem>();
            this.ItemNonLiveList = new List<LeaguePerformanceItem>();
            this.Total = new LeaguePerformanceItem();
            this.TotalItemLive = new LeaguePerformanceItem();
            this.TotalItemNonLive = new LeaguePerformanceItem();
        }

        public List<LeaguePerformanceItem> ItemByOrderList { get; set; }

        public List<LeaguePerformanceItem> ItemLiveList { get; set; }

        public List<LeaguePerformanceItem> ItemNonLiveList { get; set; }

        public LeaguePerformanceItem Total { get; set; }

        public LeaguePerformanceItem TotalItemLive { get; set; }

        public LeaguePerformanceItem TotalItemNonLive { get; set; }

        public void AddLeagueList(IEnumerable<LeaguePerformanceInfo> leaguePerformanceInfos)
        {
            foreach (var item in leaguePerformanceInfos)
            {
                if (item != null)
                {
                    this.AddItem(new LeaguePerformanceItem(item));
                }
            }
        }

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

        private void AddItem(LeaguePerformanceItem item)
        {
            this.ItemByOrderList.Add(item);

            CalculateTotal(item, item.IsLive);
        }
      
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

        private void CalculateTotal(LeaguePerformanceItem item, bool isLive)
        {
            if (isLive)
            {
                this.TotalItemLive.NoOfTraders += item.NoOfTraders;
                this.TotalItemLive.NoOfMatches += item.NoOfMatches;
                this.TotalItemLive.Turnover += item.Turnover;
                this.TotalItemLive.WinLoss += item.WinLoss;
                this.TotalItemLive.BetCount += item.BetCount;
            }
            else
            {
                this.TotalItemNonLive.NoOfTraders += item.NoOfTraders;
                this.TotalItemNonLive.NoOfMatches += item.NoOfMatches;
                this.TotalItemNonLive.Turnover += item.Turnover;
                this.TotalItemNonLive.WinLoss += item.WinLoss;
                this.TotalItemNonLive.BetCount += item.BetCount;
            }
        }
    }
}