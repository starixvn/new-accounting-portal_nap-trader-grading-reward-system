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
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
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
            this.ItemLiveList = new List<GradePerformanceItem>();
            this.ItemNonLiveList = new List<GradePerformanceItem>();
            this.Total = new GradePerformanceItem();
        }

        public List<GradePerformanceItem> ItemLiveList { get; set; }

        public List<GradePerformanceItem> ItemNonLiveList { get; set; }

        public GradePerformanceItem Total { get; set; }

        public void AddGradeList(IEnumerable<GradePerformanceInfo> gradePerformanceInfos, bool isLive)
        {
            foreach (var item in gradePerformanceInfos)
            {
                if (item != null)
                {
                    this.AddItem(new GradePerformanceItem(item), isLive);
                }
            }
        }
       
        private void AddItem(GradePerformanceItem item, bool isLive)
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

        private void CalculateTotal(GradePerformanceItem item)
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