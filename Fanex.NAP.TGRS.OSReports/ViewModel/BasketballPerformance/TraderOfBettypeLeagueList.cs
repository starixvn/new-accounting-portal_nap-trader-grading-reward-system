namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class TraderOfBettypeLeagueList
    {
        public TraderOfBettypeLeagueList()
        {
            Items = new List<TraderOfBettypeLeagueItem>();
            Total = new TraderOfBettypeLeagueItem();
        }

        public List<TraderOfBettypeLeagueItem> Items { get; set; }

        public TraderOfBettypeLeagueItem Total { get; set; }

        public void AddTrader(TraderOfBettypeLeagueInfo info)
        {
            var item = new TraderOfBettypeLeagueItem(info);

            this.Items.Add(item);

            CaculateTotal(item);
        }

        public void CalculateMargin(TraderOfBettypeLeagueItem item)
        {
            if (item.Turnover != 0)
            {
                item.Margin = item.WinLoss / item.Turnover * 100;
            }
        }

        public void CaculateTotal(TraderOfBettypeLeagueItem item)
        {
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.BetCount += item.BetCount;
        }
    }
}
