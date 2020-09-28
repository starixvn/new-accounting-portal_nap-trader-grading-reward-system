namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class TraderOfBettypeList
    {
        public TraderOfBettypeList()
        {
            Items = new List<TraderOfBettypeItem>();
            Total = new TraderOfBettypeItem();
        }

        public List<TraderOfBettypeItem> Items { get; set; }

        public TraderOfBettypeItem Total { get; set; }

        public void AddTrader(TraderOfBettypeInfo info)
        {
            var item = new TraderOfBettypeItem(info);

            this.Items.Add(item);

            CaculateTotal(item);
        }

        public void CalculateMargin(TraderOfBettypeItem item)
        {
            if (item.Turnover != 0)
            {
                item.Margin = item.WinLoss / item.Turnover * 100;
            }
        }

        public void CaculateTotal(TraderOfBettypeItem item)
        {
            this.Total.NoOfLeagues += item.NoOfLeagues;
            this.Total.NoOfMatches += item.NoOfMatches;
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.BetCount += item.BetCount;
        }
    }
}
