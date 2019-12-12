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
            this.MatchGroup = matchGroup;
        }

        public int MatchGroup { get; set; }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }        

        public string RangeDateValue
        {
            get
            {
                var fromValue = this.FromDate.HasValue
                    ? this.FromDate.Value.ToShortDateString() + " " + this.FromDate.Value.ToShortTimeString()
                    : string.Empty;
                var toValue = this.ToDate.HasValue
                    ? this.ToDate.Value.ToShortDateString() + " " + this.ToDate.Value.ToShortTimeString()
                    : string.Empty;

                return fromValue + " - " + toValue;
            }
        }

        private void ArrangeRangeDate(MatchPerformanceInfo item)
        {
            if (this.FromDate == null || this.FromDate > item.GlobalShowTime)
            {
                this.FromDate = item.GlobalShowTime;
            }
            if (this.ToDate == null || this.ToDate < item.GlobalShowTime)
            {
                this.ToDate = item.GlobalShowTime;
            }
        }

        public ICollection<MatchPerformanceItem> ItemList { get; set; }

        public MatchPerformanceItem Total { get; set; }
       
        public void AddMatchList(IGrouping<int, MatchPerformanceInfo> grouping)
        {
            var groupOrder = grouping.OrderBy(c => c.GlobalShowTime);
            foreach (var item in groupOrder)
            {
                if (item != null)
                {
                    this.ArrangeRangeDate(item);
                    this.AddItem(new MatchPerformanceItem(item));
                }
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
            this.Total.Margin += item.Margin;
        }
    }
}