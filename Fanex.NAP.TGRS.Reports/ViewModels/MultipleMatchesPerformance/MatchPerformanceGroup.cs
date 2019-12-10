namespace Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance;

    /// <summary>
    /// Match performance group view model.
    /// </summary>
    [Serializable]
    public class MatchPerformanceGroup
    {
        public MatchPerformanceGroup()
        {
            this.ItemList = new LinkedList<MatchPerformanceItem>();
            this.Total = new MatchPerformanceItem();
        }

        public MatchPerformanceGroup(int matchGroup)
            : this()
        {
            this.MatchGroupKey = matchGroup;
        }

        public int MatchGroupKey { get; set; }

        public DateTime? EventDate { get; set; }

        public DateTime? GlobalShowTime { get; set; }

        public string MatchGroupValue
        {
            get
            {
                var fromValue = this.EventDate.HasValue ? this.EventDate.Value.ToShortDateString() : string.Empty;
                var toValue = this.GlobalShowTime.HasValue ? this.GlobalShowTime.Value.ToShortDateString() : string.Empty;

                return fromValue + " - " + toValue;
            }
        }

        public ICollection<MatchPerformanceItem> ItemList { get; set; }

        public MatchPerformanceItem Total { get; set; }
       
        public void AddMatchList(IGrouping<int, MatchPerformanceInfo> grouping)
        {
            foreach (var item in grouping)
            {
                if (item != null)
                {
                    this.ArrangeRangeDate(item);
                    this.AddItem(new MatchPerformanceItem(item));
                }
            }
        }

        private void ArrangeRangeDate(MatchPerformanceInfo item)
        {
            if (this.EventDate == null || this.EventDate > item.EventDate)
            {
                this.EventDate = item.EventDate;
            }
            if (this.GlobalShowTime == null || this.GlobalShowTime < item.GlobalShowTime)
            {
                this.GlobalShowTime = item.GlobalShowTime;
            }
        }

        private void AddItem(MatchPerformanceItem item)
        {
            this.ItemList.Add(item);

            CalculateTotal(item);
        }

        private void CalculateTotal(MatchPerformanceItem item)
        {
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.BetCount += item.BetCount;
        }
    }
}