namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class MatchOfBettypeTraderGroup
    {
        public MatchOfBettypeTraderGroup()
        {
            this.Items = new List<MatchOfBettypeTraderItem>();
            this.Total = new MatchOfBettypeTraderItem();
        }

        public MatchOfBettypeTraderGroup(int leagueId) : this()
        {
            this.LeagueId = leagueId;
            this.LeagueName = CacheRef.GetLeagueName(this.LeagueId);
        }

        public List<MatchOfBettypeTraderItem> Items { get; set; }

        public MatchOfBettypeTraderItem Total { get; set; }

        public int LeagueId { get; set; }

        public string LeagueName { get; set; }
       
        public void AddItem(MatchOfBettypeTraderInfo info)
        {
            var item = new MatchOfBettypeTraderItem(info);

            this.Items.Add(item);

            CaculateTotal(item);
        }

        public void CalculateMargin(MatchOfBettypeTraderItem item)
        {
            if (item.Turnover != 0)
            {
                item.Margin = item.WinLoss / item.Turnover * 100;
            }
        }

        public void CaculateTotal(MatchOfBettypeTraderItem item)
        {
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.BetCount += item.BetCount;
        }
    }
}
