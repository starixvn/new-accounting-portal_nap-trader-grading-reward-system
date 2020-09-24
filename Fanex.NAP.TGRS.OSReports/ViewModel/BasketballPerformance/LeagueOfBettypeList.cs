namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class LeagueOfBettypeList
    {
        public LeagueOfBettypeList()
        {
            Items = new List<LeagueOfBettypeItem>();
            Total = new LeagueOfBettypeItem();
        }

        public List<LeagueOfBettypeItem> Items { get; set; }

        public LeagueOfBettypeItem Total { get; set; }

        public void AddLeague(LeagueOfBettypeInfo info)
        {
            var item = new LeagueOfBettypeItem(info);

            this.Items.Add(item);

            CaculateTotal(item);
        }

        public void CalculateMargin(LeagueOfBettypeItem item)
        {
            if (item.Turnover != 0)
            {
                item.Margin = item.WinLoss / item.Turnover * 100;
            }
        }

        public void CaculateTotal(LeagueOfBettypeItem item)
        {
            this.Total.NoOfTraders += item.NoOfTraders;
            this.Total.NoOfMatches += item.NoOfMatches;
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.BetCount += item.BetCount;
        }
    }
}
