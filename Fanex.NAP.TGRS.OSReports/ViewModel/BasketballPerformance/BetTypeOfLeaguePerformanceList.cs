using System;
using System.Collections.Generic;

namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    [Serializable]
    public class BetTypeOfLeaguePerformanceList
    {
        public List<BetTypeOfLeaguePerformanceItem> ItemLiveList { get; set; } = new List<BetTypeOfLeaguePerformanceItem>();

        public List<BetTypeOfLeaguePerformanceItem> ItemNonLiveList { get; set; } = new List<BetTypeOfLeaguePerformanceItem>();

        public BetTypeOfLeaguePerformanceItem Total { get; set; } = new BetTypeOfLeaguePerformanceItem();

        public void AddBetTypeList(IEnumerable<BetTypeOfLeaguePerformanceInfo> matchPerformanceInfos, bool isLive)
        {
            foreach (var item in matchPerformanceInfos)
            {
                if (item != null)
                {
                    this.AddItem(new BetTypeOfLeaguePerformanceItem(item), isLive);
                }
            }
        }

        private void AddItem(BetTypeOfLeaguePerformanceItem item, bool isLive)
        {
            if (isLive)
            {
                this.ItemLiveList.Add(item);
            }
            else
            {
                this.ItemNonLiveList.Add(item);
            }

            CalculateTotal(item);
        }

        private void CalculateTotal(BetTypeOfLeaguePerformanceItem item)
        {
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.Turnover_AR += item.Turnover_AR;
            this.Total.WinLoss_AR += item.WinLoss_AR;
            this.Total.BetCount += item.BetCount;
            this.Total.Margin += item.Margin;
            this.Total.Margin_AR += item.Margin_AR;
        }
    }
}
