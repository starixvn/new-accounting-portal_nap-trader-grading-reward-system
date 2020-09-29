namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class LeagueOfBettypeBetChoiceList
    {
        public LeagueOfBettypeBetChoiceList()
        {
            this.Items = new List<LeagueOfBettypeBetChoiceItem>();
            this.Total = new LeagueOfBettypeBetChoiceItem();
        }

        public List<LeagueOfBettypeBetChoiceItem> Items { get; set; }

        public LeagueOfBettypeBetChoiceItem Total { get; set; }

        public void AddLeague(LeagueOfBettypeBetChoiceInfo info, string leagueGroupName)
        {
            var item = new LeagueOfBettypeBetChoiceItem(info);
            item.LeagueGroupName = leagueGroupName;

            this.Items.Add(item);

            CaculateTotal(item);
        }

        public void CalculateMargin(LeagueOfBettypeBetChoiceItem item)
        {
            if (item.Turnover != 0)
            {
                item.Margin = item.WinLoss / item.Turnover * 100;
            }
        }

        public void CaculateTotal(LeagueOfBettypeBetChoiceItem item)
        {
            this.Total.NoOfTraders += item.NoOfTraders;
            this.Total.NoOfMatches += item.NoOfMatches;
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.BetCount += item.BetCount;
        }

    }
}
