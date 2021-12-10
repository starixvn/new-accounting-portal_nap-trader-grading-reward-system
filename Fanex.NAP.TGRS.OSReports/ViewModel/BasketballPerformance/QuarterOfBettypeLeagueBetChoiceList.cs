namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class QuarterOfBettypeLeagueBetChoiceList
    {
        public QuarterOfBettypeLeagueBetChoiceList()
        {
            this.Items = new List<QuarterOfBettypeLeagueBetChoiceItem>();
            this.Total = new QuarterOfBettypeLeagueBetChoiceItem();
        }

        public List<QuarterOfBettypeLeagueBetChoiceItem> Items { get; set; }

        public QuarterOfBettypeLeagueBetChoiceItem Total { get; set; }

        public void AddQuarter(int betTypeId, QuarterOfBettypeLeagueBetChoiceInfo info)
        {
            var item = new QuarterOfBettypeLeagueBetChoiceItem(betTypeId, info);

            this.Items.Add(item);

            CaculateTotal(item);
        }

        public void CalculateMargin(QuarterOfBettypeLeagueBetChoiceItem item)
        {
            if (item.Turnover != 0)
            {
                item.Margin = item.WinLoss / item.Turnover * 100;
            }
        }

        public void CaculateTotal(QuarterOfBettypeLeagueBetChoiceItem item)
        {            
            this.Total.NoOfMatches += item.NoOfMatches;
            this.Total.WinLoss += item.WinLoss;
            this.Total.Turnover += item.Turnover;
            this.Total.BetCount += item.BetCount;
        }

    }
}
