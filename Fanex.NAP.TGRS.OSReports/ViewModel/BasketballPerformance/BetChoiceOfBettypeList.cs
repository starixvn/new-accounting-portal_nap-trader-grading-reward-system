namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class BetChoiceOfBettypeList
    {
        public BetChoiceOfBettypeList()
        {
            this.Items = new List<BetChoiceOfBettypeItem>();
            this.Total = new BetChoiceOfBettypeItem();
            this.IsBetTypeQuarter = false;
        }
     
        public List<BetChoiceOfBettypeItem> Items { get; set; }

        public BetChoiceOfBettypeItem Total { get; set; }

        public bool IsBetTypeQuarter { get; set; }

        public void AddBetChoice(BetChoiceOfBettypeInfo info)
        {
            var item = new BetChoiceOfBettypeItem(info);

            this.Items.Add(item);

            CaculateTotal(item);
        }

        public void CalculateMargin(BetChoiceOfBettypeItem item)
        {
            if (item.Turnover != 0)
            {
                item.Margin = item.WinLoss / item.Turnover * 100;
            }
        }

        public void CaculateTotal(BetChoiceOfBettypeItem item)
        {
            this.Total.NoOfLeagues += item.NoOfLeagues;
            this.Total.NoOfMatches += item.NoOfMatches;
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.BetCount += item.BetCount;
        }
    }
}
