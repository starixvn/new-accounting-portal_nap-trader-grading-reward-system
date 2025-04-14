namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class QuarterOfBettypeBetChoiceList
    {
        public QuarterOfBettypeBetChoiceList() 
        {
            this.Items = new List<QuarterOfBettypeBetChoiceItem>();
            this.Total = new QuarterOfBettypeBetChoiceItem();
        }

        public List<QuarterOfBettypeBetChoiceItem> Items { get; set; }

        public QuarterOfBettypeBetChoiceItem Total { get; set; }

        public void AddQuarter(int betTypeId, QuarterOfBettypeBetChoiceInfo info)
        {
            var item = new QuarterOfBettypeBetChoiceItem(betTypeId, info);

            this.Items.Add(item);

            CaculateTotal(item);
        }

        public void CalculateMargin(QuarterOfBettypeBetChoiceItem item)
        {
            if (item.Turnover != 0)
            {
                item.Margin = item.WinLoss / item.Turnover * 100;
            }
        }

        public void CaculateTotal(QuarterOfBettypeBetChoiceItem item)
        {
            this.Total.NoOfLeagues += item.NoOfLeagues;
            this.Total.NoOfMatches += item.NoOfMatches;
            this.Total.WinLoss += item.WinLoss;
            this.Total.Turnover += item.Turnover;                 
            this.Total.BetCount += item.BetCount;
        }
       
    }

    public class HdpOfBettypeBetChoiceList
    {
        public HdpOfBettypeBetChoiceList()
        {
            this.Items = new List<HdpOfBettypeBetChoiceItem>();
            this.Total = new HdpOfBettypeBetChoiceItem();
        }

        public List<HdpOfBettypeBetChoiceItem> Items { get; set; }

        public HdpOfBettypeBetChoiceItem Total { get; set; }

        public void AddHdp(int betTypeId, HdpOfBettypeBetChoiceInfo info)
        {
            var item = new HdpOfBettypeBetChoiceItem(betTypeId, info);

            this.Items.Add(item);

            CaculateTotal(item);
        }

        public void CalculateMargin(HdpOfBettypeBetChoiceItem item)
        {
            if (item.Turnover != 0)
            {
                item.Margin = item.WinLoss / item.Turnover * 100;
            }
        }

        public void CaculateTotal(HdpOfBettypeBetChoiceItem item)
        {
            this.Total.NoOfLeagues += item.NoOfLeagues;
            this.Total.NoOfMatches += item.NoOfMatches;
            this.Total.WinLoss += item.WinLoss;
            this.Total.Turnover += item.Turnover;
            this.Total.BetCount += item.BetCount;
        }

    }
}
