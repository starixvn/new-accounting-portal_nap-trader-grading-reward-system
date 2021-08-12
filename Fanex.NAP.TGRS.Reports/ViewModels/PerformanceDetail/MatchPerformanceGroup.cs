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
    using System.Linq;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;

    /// <summary>
    /// Match performance group view model.
    /// </summary>
    [Serializable]
    public class MatchPerformanceGroup
    {
        public MatchPerformanceGroup()
        {
            this.ItemLiveList = new LinkedList<MatchPerformanceItem>();
            this.ItemNonLiveList = new LinkedList<MatchPerformanceItem>();
            this.Total = new MatchPerformanceItem();
        }

        public MatchPerformanceGroup(int? leagueId)
            : this()
        {
            if (leagueId.HasValue)
            {
                this.LeagueId = leagueId.Value;
                this.LeagueName = CacheRef.GetLeagueName(this.LeagueId);
            }
        }

        public int LeagueId { get; set; }

        public string LeagueName { get; set; }

        public ICollection<MatchPerformanceItem> ItemLiveList { get; set; }

        public ICollection<MatchPerformanceItem> ItemNonLiveList { get; set; }

        public MatchPerformanceItem Total { get; set; }

        public void AddMatchList(IEnumerable<MatchPerformanceInfo> matchPerformanceInfos, bool isLive)
        {
            foreach (var item in matchPerformanceInfos)
            {
                if (item != null)
                {
                    this.AddItem(new MatchPerformanceItem(item), isLive);
                }
            }
        }

        public void AddMatchList(IEnumerable<MatchPerformanceRawInfo> matchPerformanceInfos, bool isLive)
        {
            foreach (var item in matchPerformanceInfos)
            {
                if (item != null)
                {
                    this.AddItem(new MatchPerformanceItem(item), isLive);
                }
            }
        }

        public void AddMatchList(IGrouping<int?, MatchPerformanceInfo> grouping, bool isLive)
        {
            foreach (var item in grouping)
            {
                if (item != null)
                {
                    this.AddItem(new MatchPerformanceItem(item), isLive);
                }                
            }
        }

        private void AddItem(MatchPerformanceItem item, bool isLive)
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
      
        private void CalculateTotal(MatchPerformanceItem item)
        {
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.TurnoverReal += item.TurnoverReal;
            this.Total.WinLossReal += item.WinLossReal;
            this.Total.BetCount += item.BetCount;
            this.Total.WinLossScore += item.WinLossScore;
            this.Total.SumCategory += item.SumCategory;
        }
    }
}