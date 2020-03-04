namespace Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance
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
            this.GroupMatchList = new LinkedList<MatchPerformanceGroup>();
            this.GrandTotal = new MatchPerformanceItem();
        }

        public int TotalItems { get; set; }

        public ICollection<MatchPerformanceGroup> GroupMatchList { get; set; }

        public MatchPerformanceItem GrandTotal { get; set; }

        /// <summary>
        /// Adds a group to the list.
        /// </summary>
        /// <param name="group">The group that needs to be added.</param>
        public void AddItem(MatchPerformanceGroup group)
        {
            if (group != null)
            {
                this.GroupMatchList.Add(group);
                this.GrandTotal.Turnover += group.Total.Turnover;
                this.GrandTotal.WinLoss += group.Total.WinLoss;
                this.GrandTotal.BetCount += group.Total.BetCount;
                this.GrandTotal.Margin += group.Total.Margin;
            }
        }
    }
}