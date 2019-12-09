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
            ItemList = new List<TraderPerformanceItem>();
            Total = new TraderPerformanceItem();
        }

        public List<TraderPerformanceItem> ItemList { get; set; }

        public TraderPerformanceItem Total { get; set; }

        public void AddTraderList(IEnumerable<TraderPerformanceInfo> traderPerformanceInfos)
        {
            foreach (var item in traderPerformanceInfos)
            {
                var itemTrader = new TraderPerformanceItem(item);
                this.ItemList.Add(itemTrader);

                CalculateTotal(itemTrader);
            }
        }

        private void CalculateTotal(TraderPerformanceItem item)
        {
            this.Total.NoOfMatches += item.NoOfMatches;
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.BetCount += item.BetCount;            
        }
    }
}