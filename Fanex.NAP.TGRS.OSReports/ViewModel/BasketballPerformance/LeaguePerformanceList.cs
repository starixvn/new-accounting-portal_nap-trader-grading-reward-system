using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
using System;
using System.Collections.Generic;

namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    [Serializable]
    public class LeaguePerformanceList
    {
        public LeaguePerformanceList()
        {
            this.Items = new List<LeaguePerformanceItem>();
            this.TotalItemLive = new LeaguePerformanceItem();
            this.TotalItemNonLive = new LeaguePerformanceItem();
        }

        public List<LeaguePerformanceItem> Items { get; set; }

        public LeaguePerformanceItem TotalItemLive { get; set; }

        public LeaguePerformanceItem TotalItemNonLive { get; set; }

        public void AddLeague(LeaguePerformanceInfo info)
        {
            var item = new LeaguePerformanceItem(info);

            this.Items.Add(item);

            CalculateTotal(item);
        }

        public void CalculateMargin(LeaguePerformanceItem item)
        {
            if (item.Turnover != 0)
            {
                item.Margin = item.WinLoss / item.Turnover * 100;
            }
        }

        private void CalculateTotal(LeaguePerformanceItem item)
        {
            if (item.IsLive)
            {
                this.TotalItemLive.TraderCount += item.TraderCount;
                this.TotalItemLive.MatchCount += item.MatchCount;
                this.TotalItemLive.Turnover += item.Turnover;
                this.TotalItemLive.WinLoss += item.WinLoss;
                this.TotalItemLive.BetCount += item.BetCount;
            }
            else
            {
                this.TotalItemNonLive.TraderCount += item.TraderCount;
                this.TotalItemNonLive.MatchCount += item.MatchCount;
                this.TotalItemNonLive.Turnover += item.Turnover;
                this.TotalItemNonLive.WinLoss += item.WinLoss;
                this.TotalItemNonLive.BetCount += item.BetCount;
            }
        }
    }
}
