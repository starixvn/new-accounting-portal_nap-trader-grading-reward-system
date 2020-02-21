namespace Fanex.NAP.TGRS.Reports.ViewModels.RTModelPerformanceDetail
{   
    using Fanex.NAP.TGRS.Reports.Models.RTModelPerformanceDetail;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    [Serializable]
    public class BetTypeList : RobotTradingModelList
    {
        public BetTypeList()
        {      
            ItemList = new List<BetTypeItem>();          
            GrandTotal = new BetTypeItem();
        }   
      
        public List<BetTypeItem> ItemList { get; set; }              

        public BetTypeItem GrandTotal { get; set; }      

        public void AddBetTypeItem(List<int> siteIdList, IEnumerable<BetTypePerformanceInfo> betTypeInfos, MatchBetCountInfo matchCountInfo, short betTypeId)
        {
            var item = new BetTypeItem(betTypeId, this.SiteList, this.MeasurementHiddenList)
                .GenerateMatchBetCount(matchCountInfo)
                .GenereateGroupVirtualTotal(siteIdList, betTypeInfos)
                .GenereateGroupVariance(siteIdList, betTypeInfos)
                .GenereateGroupRealTotal(siteIdList, betTypeInfos)
                .GenereateGroupTotal8RM(siteIdList, betTypeInfos)
                .GenereateGroupRealTotal8RMWL(siteIdList, betTypeInfos);

            this.ItemList.Add(item);

            if (!this.KeyList.Any())
            {
                this.KeyList.AddRange(item.RobotTradingItemList.Select(x => x.Key));
            }
        }        

        public void GenerateGrandTotal()
        {
            foreach (var key in this.KeyList)
            {
                var items = this.ItemList.Select(x => x.RobotTradingItemList.ContainsKey(key) ? x.RobotTradingItemList[key] : null);
                var value = items.Aggregate<RobotTradingItem, RobotTradingItem>(null, (acc, s) => acc + s);

                if (value != null)
                {
                    this.GrandTotal.RobotTradingItemList.Add(key, value);
                }
            }

            this.GrandTotal.MatchCount = this.ItemList.Sum(x => x.MatchCount);
            this.GrandTotal.BetCount = this.ItemList.Sum(x => x.BetCount);
        }       
    }
}