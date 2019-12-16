namespace Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance
{
    using Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance;
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// Trader performance list view model.
    /// </summary>
    [Serializable]
    public class TraderPerformanceList
    {
        public TraderPerformanceList()
        {
            this.GroupList = new LinkedList<TraderPerformanceGroup>();
            this.GrandTotal = new TraderPerformanceItem();
        }

        public int TotalItems { get; set; }

        public ICollection<TraderPerformanceGroup> GroupList { get; set; }

        public TraderPerformanceItem GrandTotal { get; set; }

        /// <summary>
        /// Adds a group to the list.
        /// </summary>
        /// <param name="group">The group that needs to be added.</param>
        public void AddItem(TraderPerformanceGroup group)
        {
            if (group != null)
            {
                this.GroupList.Add(group);
                this.GrandTotal.Count += group.Total.Count;
                this.GrandTotal.Turnover += group.Total.Turnover;
                this.GrandTotal.WinLoss += group.Total.WinLoss;
                this.GrandTotal.BetCount += group.Total.BetCount;
            }
        }
    }
}