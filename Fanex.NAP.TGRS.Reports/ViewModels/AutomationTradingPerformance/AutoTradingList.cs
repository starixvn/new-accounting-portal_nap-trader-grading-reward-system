namespace Fanex.NAP.TGRS.Reports.ViewModels.AutomationTradingPerformance
{
    using Fanex.NAP.TGRS.Reports.Models.AutomationTradingPerformance;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    [Serializable]
    public class AutoTradingList : AutoTradingModelList
    {
        public AutoTradingList() : base()
        {
            ItemList = new List<AutoTradingItem>();
            GrandTotal = new AutoTradingItem();
        }

        public IList<AutoTradingItem> ItemList { get; set; }

        public AutoTradingItem GrandTotal { get; set; }

        public void AddAutoTradingItem(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos, SummaryLeagueMatchBetCountInfo leagueMatchCountInfo, string autoTradingName)
        {
            var item = new AutoTradingItem(autoTradingName, this.SiteList, this.MeasurementHiddenList)
                .GenerateSummary(leagueMatchCountInfo)
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

        public void GenerateGrandTotal(bool isRecalculateMatchCount = false)
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
            this.GrandTotal.MatchCount = isRecalculateMatchCount ? this.ItemList.Sum(x=>x.MatchCount) : this.MatchCount;
            this.GrandTotal.BetCount = this.ItemList.Sum(x => x.BetCount);
        }
    }
}