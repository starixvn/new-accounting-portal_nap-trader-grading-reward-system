namespace Fanex.NAP.TGRS.Reports.ViewModels.AutomationTradingPerformance
{   
    using Fanex.NAP.TGRS.Reports.Models.AutomationTradingPerformance;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    [Serializable]
    public class PeriodList : RobotTradingModelList
    {
        public PeriodList ()
        {
            ItemList = new List<PeriodItem>();
            GrandTotal = new PeriodItem();
        }                    

        public IList<PeriodItem> ItemList { get; set; }        

        public PeriodItem GrandTotal { get; set; }             

        public void AddPeriodItem(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos, MatchBetCountInfo matchCountInfo, string period)
        {
            var item = new PeriodItem(period, this.SiteList, this.MeasurementHiddenList)
                .GenerateMatchBetCount(matchCountInfo)
                .GenereateGroupVirtualTotal(siteIdList, infos)
                .GenereateGroupVariance(siteIdList, infos)
                .GenereateGroupRealTotal(siteIdList, infos)
                .GenereateGroupTotal8RM(siteIdList, infos)
                .GenereateGroupRealTotal8RMWL(siteIdList, infos);

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

            this.GrandTotal.LeagueCount = this.LeagueCount;
            this.GrandTotal.MatchCount = this.MatchCount;
            this.GrandTotal.BetCount = this.ItemList.Sum(x => x.BetCount);
        }              

    }
}