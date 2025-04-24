using System;
using System.Collections.Generic;

namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    [Serializable]
    public class MatchOfLeaguePerformanceList
    {
        public List<MatchOfLeaguePerformanceItem> ItemLiveList { get; set; } = new List<MatchOfLeaguePerformanceItem>();

        public List<MatchOfLeaguePerformanceItem> ItemNonLiveList { get; set; } = new List<MatchOfLeaguePerformanceItem>();

        public MatchOfLeaguePerformanceItem Total { get; set; } = new MatchOfLeaguePerformanceItem();

        public void AddMatchList(IEnumerable<MatchOfLeaguePerformanceInfo> matchPerformanceInfos, bool isLive)
        {
            foreach (var item in matchPerformanceInfos)
            {
                if (item != null)
                {
                    this.AddItem(new MatchOfLeaguePerformanceItem(item), isLive);
                }
            }
        }

        private void AddItem(MatchOfLeaguePerformanceItem item, bool isLive)
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

        private void CalculateTotal(MatchOfLeaguePerformanceItem item)
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
