namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail
{
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class BetTypeBetChoiceList
    {
        public BetTypeBetChoiceList()
        {
            this.IsFMBetType = false;
            this.IsBetChoiceDetail = false;
            this.ItemList = new List<BetTypeBetChoiceItem>();
            this.Total = new BetTypeBetChoiceItem();
        }        

        public bool IsFMBetType { get; set; }

        public bool IsBetChoiceDetail { get; set; }

        public List<BetTypeBetChoiceItem> ItemList { get; set; }

        public BetTypeBetChoiceItem Total { get; set; }

        public void AddItem(IEnumerable<BetTypeBetChoicePerformanceInfo> infos)
        {
            foreach (var info in infos)
            {
                if (info != null)
                {
                    var item = new BetTypeBetChoiceItem(info);

                    this.ItemList.Add(item);

                    CalculateTotal(item);
                }
            }

            this.Total.Margin = CalculateTotalMargin(this.Total.WinLoss, this.Total.Turnover);
            this.Total.MarginReal = CalculateTotalMargin(this.Total.WinLossReal, this.Total.TurnoverReal);
        }

        private void CalculateTotal(BetTypeBetChoiceItem item)
        {           
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.TurnoverReal += item.TurnoverReal;
            this.Total.WinLossReal += item.WinLossReal;
            this.Total.MatchCount += item.MatchCount;
            this.Total.BetCount += item.BetCount;
        }

        private decimal? CalculateTotalMargin(decimal winLoss, decimal turnover)
        {
            decimal? margin = null;

            if (turnover != 0)
            {
                margin = winLoss / turnover * 100;
            }

            return margin;
        }

    }
}
