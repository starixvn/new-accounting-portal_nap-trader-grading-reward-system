namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
    using System.Collections.Generic;

    public class BetChoiceOfBettypeLeagueList
    {
        public BetChoiceOfBettypeLeagueList()
        {
            this.Items = new List<BetChoiceOfBettypeLeagueItem>();
            this.Total = new BetChoiceOfBettypeLeagueItem();
            this.IsBetTypeQuarter = false;
        }

        public List<BetChoiceOfBettypeLeagueItem> Items { get; set; }

        public BetChoiceOfBettypeLeagueItem Total { get; set; }

        public bool IsBetTypeQuarter { get; set; }

        public void AddBetChoice(BetChoiceOfBettypeLeagueInfo info)
        {
            var item = new BetChoiceOfBettypeLeagueItem(info);

            this.Items.Add(item);

            CaculateTotal(item);
        }

        public void CalculateMargin(BetChoiceOfBettypeLeagueItem item)
        {
            if (item.Turnover != 0)
            {
                item.Margin = item.WinLoss / item.Turnover * 100;
            }
        }

        public void CaculateTotal(BetChoiceOfBettypeLeagueItem item)
        {
            this.Total.NoOfMatches += item.NoOfMatches;
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.BetCount += item.BetCount;
        }
    }
}
