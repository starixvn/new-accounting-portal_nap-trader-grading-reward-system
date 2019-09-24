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
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
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
            this.ItemByOrderList = new List<BetTypePerformanceItem>();
            this.ItemLiveList = new List<BetTypePerformanceItem>();
            this.ItemNonLiveList = new List<BetTypePerformanceItem>();
            this.Total = new BetTypePerformanceItem();
            this.TotalItemLive = new BetTypePerformanceItem();
            this.TotalItemNonLive = new BetTypePerformanceItem();
        }

        public List<BetTypePerformanceItem> ItemByOrderList { get; set; }

        public List<BetTypePerformanceItem> ItemLiveList { get; set; }

        public List<BetTypePerformanceItem> ItemNonLiveList { get; set; }

        public BetTypePerformanceItem Total { get; set; }

        public BetTypePerformanceItem TotalItemLive { get; set; }

        public BetTypePerformanceItem TotalItemNonLive { get; set; }

        public void AddBetTypeList(IEnumerable<BetTypePerformanceInfo> betTypePerformanceInfos)
        {
            foreach (var item in betTypePerformanceInfos)
            {
                if (item != null)
                {
                    this.AddItem(new BetTypePerformanceItem(item));
                }
            }
        }

        public void AddBetTypeList(IEnumerable<BetTypePerformanceInfo> betTypePerformanceInfos, bool isLive)
        {
            foreach (var item in betTypePerformanceInfos)
            {
                if (item != null)
                {
                    this.AddItem(new BetTypePerformanceItem(item), isLive);
                }
            }
        }

        private void AddItem(BetTypePerformanceItem item)
        {
            this.ItemByOrderList.Add(item);

            CalculateTotal(item, item.IsLive);
        }

        private void AddItem(BetTypePerformanceItem item, bool isLive)
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

        private void CalculateTotal(BetTypePerformanceItem item)
        {
            this.Total.NoOfTraders += item.NoOfTraders;
            this.Total.NoOfLeagues += item.NoOfLeagues;
            this.Total.NoOfMatches += item.NoOfMatches;
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.BetCount += item.BetCount;
        }

        private void CalculateTotal(BetTypePerformanceItem item, bool isLive)
        {
            if (isLive)
            {
                this.TotalItemLive.NoOfTraders += item.NoOfTraders;
                this.TotalItemLive.NoOfLeagues += item.NoOfLeagues;
                this.TotalItemLive.NoOfMatches += item.NoOfMatches;
                this.TotalItemLive.Turnover += item.Turnover;
                this.TotalItemLive.WinLoss += item.WinLoss;
                this.TotalItemLive.BetCount += item.BetCount;
            }
            else
            {
                this.TotalItemNonLive.NoOfTraders += item.NoOfTraders;
                this.TotalItemNonLive.NoOfLeagues += item.NoOfLeagues;
                this.TotalItemNonLive.NoOfMatches += item.NoOfMatches;
                this.TotalItemNonLive.Turnover += item.Turnover;
                this.TotalItemNonLive.WinLoss += item.WinLoss;
                this.TotalItemNonLive.BetCount += item.BetCount;
            }
        }
    }
}