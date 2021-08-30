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
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using System;
    using System.Collections.Generic;
    using System.Linq;

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
            var leagueGroups = SessionManager.Get<List<LeagueGroup>>("Fanex.NAP.TGRS.Reports.LeagueGroups");

            foreach (var item in leaguePerformanceInfos)
            {
                if (item != null)
                {
                    var leagueGroupName = "-";
                    if (leagueGroups != null && item.LeagueGroupID.HasValue)
                    {
                        var group = leagueGroups
                            .Where(x => x.LeagueGroupId < 12 && x.LeagueGroupId.Equals(item.LeagueGroupID.Value))
                            .Select(x => x.LeagueGroupName).ToList();

                        var otherGroup = leagueGroups
                            .Where(x => x.LeagueGroupId >= 12)
                            .Select(x => x.LeagueGroupName).ToList();

                        leagueGroupName = group.Any()
                            ? group[0]
                            : (otherGroup.Any() ? "Other Groups" : "-");
                    }
                    var itemData = new LeaguePerformanceItem(item);
                    itemData.LeagueGroupName = leagueGroupName;

                    this.AddItem(itemData);
                }
            }
        }

        public void AddLeagueList(IEnumerable<LeaguePerformanceInfo> leaguePerformanceInfos, bool isLive)
        {
            var leagueGroups = SessionManager.Get<List<LeagueGroup>>("Fanex.NAP.TGRS.Reports.LeagueGroups");

            foreach (var item in leaguePerformanceInfos)
            {
                if (item != null)
                {
                    var leagueGroupName = "-";
                    if (leagueGroups != null && item.LeagueGroupID.HasValue)
                    {
                        var group = leagueGroups
                            .Where(x => x.LeagueGroupId < 12 && x.LeagueGroupId.Equals(item.LeagueGroupID.Value))
                            .Select(x => x.LeagueGroupName).ToList();

                        var otherGroup = leagueGroups
                            .Where(x=>x.LeagueGroupId >= 12)
                            .Select(x => x.LeagueGroupName).ToList();

                        leagueGroupName = group.Any() 
                            ? group[0] 
                            : (otherGroup.Any() ? "Other Groups" : "-");
                    }
                    var itemData = new LeaguePerformanceItem(item);
                    itemData.LeagueGroupName = leagueGroupName;

                    this.AddItem(itemData, isLive);
                }
            }
        }

        public void CalculateTotalMargin()
        {
            if (this.Total != null)
            {
                this.Total.Margin = CalculateTotalMargin(this.Total.WinLoss, this.Total.Turnover);
                this.Total.MarginReal = CalculateTotalMargin(this.Total.WinLossReal, this.Total.TurnoverReal);
            }

            if (this.TotalItemLive != null)
            {
                this.TotalItemLive.Margin = CalculateTotalMargin(this.TotalItemLive.WinLoss, this.TotalItemLive.Turnover);
                this.TotalItemLive.MarginReal = CalculateTotalMargin(this.TotalItemLive.WinLossReal, this.TotalItemLive.TurnoverReal);
            }

            if (this.TotalItemNonLive != null)
            {
                this.TotalItemNonLive.Margin = CalculateTotalMargin(this.TotalItemNonLive.WinLoss, this.TotalItemNonLive.Turnover);
                this.TotalItemNonLive.MarginReal = CalculateTotalMargin(this.TotalItemNonLive.WinLossReal, this.TotalItemNonLive.TurnoverReal);
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
            this.Total.NoOfBetChoices += item.NoOfBetChoices;
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.TurnoverReal += item.TurnoverReal;
            this.Total.WinLossReal += item.WinLossReal;
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
                this.TotalItemLive.TurnoverReal += item.TurnoverReal;
                this.TotalItemLive.WinLossReal += item.WinLossReal;
                this.TotalItemLive.BetCount += item.BetCount;
            }
            else
            {
                this.TotalItemNonLive.NoOfTraders += item.NoOfTraders;
                this.TotalItemNonLive.NoOfMatches += item.NoOfMatches;
                this.TotalItemNonLive.Turnover += item.Turnover;
                this.TotalItemNonLive.WinLoss += item.WinLoss;
                this.TotalItemNonLive.TurnoverReal += item.TurnoverReal;
                this.TotalItemNonLive.WinLossReal += item.WinLossReal;
                this.TotalItemNonLive.BetCount += item.BetCount;
            }
        }

        private decimal? CalculateTotalMargin(decimal winLoss, decimal turnover)
        {
            decimal? margin = null;

            if (turnover != 0)
            {
                margin = winLoss / turnover * 100;
            }

            return margin;
        }
    }
}