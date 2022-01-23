namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail
{
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class TimeMachinePerformanceList
    {
        public TimeMachinePerformanceList()
        {
            this.ItemList = new List<TimeMachinePerformanceItem>();
            this.Total = new TimeMachinePerformanceItem();
        }

        public List<TimeMachinePerformanceItem> ItemList { get; set; }

        public TimeMachinePerformanceItem Total { get; set; }

        public void AddItem(IEnumerable<TimeMachinePerformanceInfo> infos, short betType)
        {
            foreach (var info in infos)
            {
                if (info != null)
                {
                    var item = new TimeMachinePerformanceItem(info, betType);

                    this.ItemList.Add(item);

                    CalculateTotal(item);
                }
            }
        }

        private void CalculateTotal(TimeMachinePerformanceItem item)
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
