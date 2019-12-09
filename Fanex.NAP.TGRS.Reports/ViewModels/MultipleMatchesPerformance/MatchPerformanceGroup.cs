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

        public MatchPerformanceGroup(string matchGroupKey)
            : this()
        {
            this.MatchGroupKey = matchGroupKey;
        }

        public string MatchGroupKey { get; set; }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }

        public string MatchGroupValue
        {
            get
            {
                var fromValue = this.FromDate.HasValue ? this.FromDate.Value.ToShortDateString() : string.Empty;
                var toValue = this.ToDate.HasValue ? this.ToDate.Value.ToShortDateString() : string.Empty;

                return fromValue + " - " + toValue;
            }
        }

        public ICollection<MatchPerformanceItem> ItemList { get; set; }

        public MatchPerformanceItem Total { get; set; }
       
        public void AddMatchList(IGrouping<string, MatchPerformanceInfo> grouping)
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
            if (this.FromDate == null || this.FromDate > item.FromDate)
            {
                this.FromDate = item.FromDate;
            }
            if (this.ToDate == null || this.ToDate < item.ToDate)
            {
                this.ToDate = item.ToDate;
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