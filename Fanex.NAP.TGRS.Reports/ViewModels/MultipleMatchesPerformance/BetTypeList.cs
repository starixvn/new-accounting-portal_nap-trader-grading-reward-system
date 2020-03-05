namespace Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance
{
    using Fanex.Common;
    using Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance;
    using System;
    using System.Collections.Generic;
    using System.Linq;    

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

        public void AddBettypeList(IEnumerable<BetTypeInfo> betTypeInfos, List<BetTypeDefaultItem> betTypeDefaultItems)
        {
            foreach (var info in betTypeInfos)
            {
                var item = this.ItemList.FirstOrDefault(x => x.BetType.Equals(info.BetType));

                if (item == null)
                {
                    item = new BetTypeItem(info, betTypeDefaultItems);
                    this.ItemList.Add(item);

                    this.Total.Turnover += item.Turnover;
                    this.Total.WinLoss += item.WinLoss;
                    this.Total.BetCount += item.BetCount;
                }
                else
                {
                    item.Turnover += Converter.ToDecimal(info.Turnover);
                    item.WinLoss += Converter.ToDecimal(info.WinLoss);
                    item.Margin = item.Turnover == 0 ? 0 : (item.WinLoss / item.Turnover) * 100;

                    this.Total.Turnover += Converter.ToDecimal(info.Turnover);
                    this.Total.WinLoss += Converter.ToDecimal(info.WinLoss);
                    this.Total.BetCount += Converter.ToInt(info.BetCount);
                }
            }
        }
    }
}