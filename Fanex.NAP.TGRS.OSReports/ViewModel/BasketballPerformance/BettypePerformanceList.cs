namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class BettypePerformanceList
    {
        public BettypePerformanceList()
        {
            this.Items = new List<BettypePerformanceItem>();
            this.TotalItemLive = new BettypePerformanceItem();
            this.TotalItemNonLive = new BettypePerformanceItem();
        }

        public List<BettypePerformanceItem> Items { get; set; }

        public BettypePerformanceItem TotalItemLive { get; set; }

        public BettypePerformanceItem TotalItemNonLive { get; set; }

        public void AddBettype(BettypePerformanceInfo info)
        {
            var item = new BettypePerformanceItem(info);

            this.Items.Add(item);

            CalculateTotal(item);
        }

        public void CalculateMargin(BettypePerformanceItem item)
        {
            if (item.Turnover != 0)
            {
                item.Margin = item.WinLoss / item.Turnover * 100;
            }
        }

        private void CalculateTotal(BettypePerformanceItem item)
        {
            if (item.IsLive)
            {
                this.TotalItemLive.NoOfTraders += item.NoOfTraders;
                this.TotalItemLive.NoOfLeagues += item.NoOfLeagues;
                this.TotalItemLive.NoOfMatches += item.NoOfMatches;
                this.TotalItemLive.Turnover += item.Turnover;
                this.TotalItemLive.WinLoss += item.WinLoss;
                this.TotalItemLive.BetCount += item.BetCount;
            }
            else
            {
                this.TotalItemNonLive.NoOfTraders += item.NoOfTraders;
                this.TotalItemNonLive.NoOfLeagues += item.NoOfLeagues;
                this.TotalItemNonLive.NoOfMatches += item.NoOfMatches;
                this.TotalItemNonLive.Turnover += item.Turnover;
                this.TotalItemNonLive.WinLoss += item.WinLoss;
                this.TotalItemNonLive.BetCount += item.BetCount;
            }
        }
    }
}
