namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
    using System;
    using System.Collections.Generic;    

    [Serializable]
    public class LeagueOfBettypeBetChoiceQuarterList
    {
        public LeagueOfBettypeBetChoiceQuarterList() 
        {
            this.Items = new List<LeagueOfBettypeBetChoiceQuarterItem>();
            this.Total = new LeagueOfBettypeBetChoiceQuarterItem();
        }

        public List<LeagueOfBettypeBetChoiceQuarterItem> Items { get; set; }

        public LeagueOfBettypeBetChoiceQuarterItem Total { get; set; }

        public void AddLeague(LeagueOfBettypeBetChoiceQuarterInfo info, string leagueGroupName)
        {
            var item = new LeagueOfBettypeBetChoiceQuarterItem(info);
            item.LeagueGroupName = leagueGroupName;

            this.Items.Add(item);            

            CaculateTotal(item);
        }

        public void CalculateMargin(LeagueOfBettypeBetChoiceQuarterItem item)
        {
            if (item.Turnover != 0)
            {
                item.Margin = item.WinLoss / item.Turnover * 100;
            }
        }

        public void CaculateTotal(LeagueOfBettypeBetChoiceQuarterItem item)
        {
            this.Total.NoOfMatches += item.NoOfMatches;
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.BetCount += item.BetCount;
        }
        
    }
}
