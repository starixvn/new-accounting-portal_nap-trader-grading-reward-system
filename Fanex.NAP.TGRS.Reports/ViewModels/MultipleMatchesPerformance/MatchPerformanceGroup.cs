namespace Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.NAP.TGRS.Core.Helpers;    

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

        public MatchPerformanceGroup(string matchGroup)
            : this()
        {
            this.MatchGroup = matchGroup;
        }

        public string MatchGroup { get; set; }        

        public ICollection<MatchPerformanceItem> ItemList { get; set; }

        public MatchPerformanceItem Total { get; set; }
       
        public void AddMatchList(IGrouping<string, MatchPerformanceInfo> grouping)
        {
            foreach (var item in grouping)
            {
                if (item != null)
                {
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
        }
    }
}
