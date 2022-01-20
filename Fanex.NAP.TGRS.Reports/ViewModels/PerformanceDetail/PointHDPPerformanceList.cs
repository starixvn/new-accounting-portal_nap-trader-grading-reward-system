namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail
{
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class PointHDPPerformanceList
    {
        public PointHDPPerformanceList()
        {
            this.ItemList = new List<PointHDPPerformanceItem>();
            this.Total = new PointHDPPerformanceItem();
        }     

        public List<PointHDPPerformanceItem> ItemList { get; set; }

        public PointHDPPerformanceItem Total { get; set; }

        public void AddItem(IEnumerable<PointHDPPerformanceInfo> infos)
        {
            foreach (var info in infos)
            {
                if (info != null)
                {
                    this.ItemList.Add(new PointHDPPerformanceItem(info));
                }
            }
        }

        private void CalculateTotal(PointHDPPerformanceItem item)
        {
            this.Total.NoOfLeagues += item.NoOfLeagues;
            this.Total.NoOfMatches += item.NoOfMatches;
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.TurnoverReal += item.TurnoverReal;
            this.Total.WinLossReal += item.WinLossReal;
            this.Total.BetCount += item.BetCount;
        }
    }
}
