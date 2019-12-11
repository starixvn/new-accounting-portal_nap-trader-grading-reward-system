namespace Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance;

    [Serializable]
    public class TraderPerformanceGroup
    {
        public TraderPerformanceGroup()
        {
            ItemList = new List<TraderPerformanceItem>();
            Total = new TraderPerformanceItem();
        }

        public TraderPerformanceGroup(int traderId) : this()
        {
            this.TraderId = traderId;
        }        

        public int TraderId { get; set; }

        public string TraderName { get; set; }

        public int Grade { get; set; }
      
        public string TeamName { get; set; }

        public List<TraderPerformanceItem> ItemList { get; set; }

        public TraderPerformanceItem Total { get; set; }

        public void AddHeader(IEnumerable<TraderPerformanceInfo> traderPerformanceInfos)
        {
            if (traderPerformanceInfos.Any())
            {
                var traders = traderPerformanceInfos.ToList();
                this.TraderName = traders[0].Username;
                this.Grade = traders[0].Grade;
                this.TeamName = traders[0].TeamName;
            }            
        }

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
            this.Total.Margin += item.Margin;
        }
    }
}