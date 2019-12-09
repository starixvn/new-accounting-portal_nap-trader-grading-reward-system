namespace Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance
{
    using Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance;
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class BetTypeList
    {
        public BetTypeList()
        {
            ItemList = new List<BetTypeItem>();
            Total = new BetTypeItem();
        }

        public List<BetTypeItem> ItemList { get; set; }

        public BetTypeItem Total { get; set; }

        public void AddBettypeList(IEnumerable<BetTypeInfo> betTypeInfos)
        {
            foreach (var item in betTypeInfos)
            {
                var itemBettype = new BetTypeItem(item);
                this.ItemList.Add(itemBettype);

                CalculateTotal(itemBettype);
            }
        }

        private void CalculateTotal(BetTypeItem item)
        {
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.BetCount += item.BetCount;           
        }
    }
}