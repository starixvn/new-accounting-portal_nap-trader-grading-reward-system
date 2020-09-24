namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class MatchOfBettypeLeagueTraderList
    {
        public MatchOfBettypeLeagueTraderList()
        {
            Items = new List<MatchOfBettypeLeagueTraderItem>();
            Total = new MatchOfBettypeLeagueTraderItem();
        }

        public List<MatchOfBettypeLeagueTraderItem> Items { get; set; }

        public MatchOfBettypeLeagueTraderItem Total { get; set; }

        public void AddMatch(MatchOfBettypeLeagueTraderInfo info)
        {
            var item = new MatchOfBettypeLeagueTraderItem(info);

            this.Items.Add(item);

            CaculateTotal(item);
        }

        public void CalculateMargin(MatchOfBettypeLeagueTraderItem item)
        {
            if (item.Turnover != 0)
            {
                item.Margin = item.WinLoss / item.Turnover * 100;
            }
        }

        public void CaculateTotal(MatchOfBettypeLeagueTraderItem item)
        {
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.BetCount += item.BetCount;
        }
    }
}
