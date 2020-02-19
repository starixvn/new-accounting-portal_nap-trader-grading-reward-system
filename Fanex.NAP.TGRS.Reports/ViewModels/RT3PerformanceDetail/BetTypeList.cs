namespace Fanex.NAP.TGRS.Reports.ViewModels.RT3PerformanceDetail
{
    using Fanex.NAP.TGRS.Core.Consts;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Models.RT3PerformanceDetail;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    [Serializable]
    public class BetTypeList
    {
        public BetTypeList()
        {
            Summary = new RobotTradingSummary();
            ItemList = new List<BetTypeItem>();
            KeyList = new List<string>();
            GroupHeaderList = new List<GroupHeader>();
            GrandTotal = new BetTypeItem();
        }

        public int LeagueCount { get; set; }

        public int MatchCount { get; set; }

        public List<BetTypeItem> ItemList { get; set; }

        public List<string> KeyList { get; set; }

        public List<GroupHeader> GroupHeaderList { get; set; }

        public RobotTradingSummary Summary { get; set; }

        public BetTypeItem GrandTotal { get; set; }

        public void AddLeagueMacthTotal(TotalLeagueMatchInfo totalInfo)
        {
            this.LeagueCount = totalInfo.LeagueCount;
            this.MatchCount = totalInfo.MatchCount;
        }

        public void AddSummary(TotalPerformanceInfo totalInfo)
        {
            this.Summary = new RobotTradingSummary
            {
                VirtualTotalTurnover = totalInfo.Total_Stake_VR,
                VirtualTotalWinLoss = totalInfo.Total_WinLoss_VR,
                VirtualTotalMargin = totalInfo.Total_Margin_VR,
                VarianceTurnover = totalInfo.Total_Stake_VAR,
                VarianceWinLoss = totalInfo.Total_Winloss_VAR,
                VarianceMargin = totalInfo.Total_Margin_VAR,
                RealTotalTurnover = totalInfo.Total_Stake_AR,
                RealTotalWinLoss = totalInfo.Total_Winloss_AR,
                RealTotalMargin = totalInfo.Total_Margin_AR,
                Total8RMTurnover = totalInfo.Total_Stake_8RM,
                Total8RMWinLoss = totalInfo.Total_Winloss_8RM,
                Total8RMMargin = totalInfo.Total_Margin_8RM,
                Total8RMWLTurnover = totalInfo.Total_Stake_AR8RM,
                Total8RMWLWinLoss = totalInfo.Total_Winloss_AR8RM,
                Total8RMWLMargin = totalInfo.Total_Margin_AR8RM
            };
        }

        public void AddBetTypeItem(IEnumerable<BetTypePerformanceInfo> betTypeInfos, short betTypeId)
        {
            var item = new BetTypeItem(betTypeId)
                .GenerateMatchBetCount(betTypeInfos)
                .GenereateGroupVirtualTotal(betTypeInfos)
                .GenereateGroupVariance(betTypeInfos)
                .GenereateGroupRealTotal(betTypeInfos)
                .GenereateGroupTotal8RM(betTypeInfos)
                .GenereateGroupRealTotal8RMWL(betTypeInfos);

            ItemList.Add(item);

            if (!KeyList.Any())
            {
                KeyList.AddRange(item.RobotTradingItemList.Select(x => x.Key));
            }
        }

        public void GenerateGrandTotal()
        {
            foreach (var key in KeyList)
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

        public void GenerateGroupHeader(string measurements, string typeSiteIds)
        {
            if (!string.IsNullOrEmpty(measurements) && !string.IsNullOrEmpty(typeSiteIds))
            {
                var siteLength = typeSiteIds.Split(',').Length;
                var arrMeasurement = measurements.Split(',');

                var listVirtualToal = arrMeasurement.Where(x => x.Contains(Consts.RobotTradingGroupHeaderVirtualTotal + "-")).Select(x => x).ToList();
                var listVariance = arrMeasurement.Where(x => x.Contains(Consts.RobotTradingGroupHeaderVariance + "-")).Select(x => x).ToList();
                var listRealTotal = arrMeasurement.Where(x => x.Contains(Consts.RobotTradingGroupHeaderRealTotal + "-")).Select(x => x).ToList();
                var listTotal8RM = arrMeasurement.Where(x => x.Contains(Consts.RobotTradingGroupHeaderTotal8RM + "-")).Select(x => x).ToList();
                var listRealTotal8RMWL = arrMeasurement.Where(x => x.Contains(Consts.RobotTradingGroupHeaderRealTotal8RMWL + "-")).Select(x => x).ToList();

                GenerateGroupHeader(listVirtualToal, siteLength, ViewLang.VirtualTotal);
                GenerateGroupHeader(listVariance, siteLength, ViewLang.Variance);
                GenerateGroupHeader(listRealTotal, siteLength, ViewLang.RealTotal);
                GenerateGroupHeader(listTotal8RM, siteLength, ViewLang.Total8RM);
                GenerateGroupHeader(listRealTotal8RMWL, siteLength, ViewLang.RealTotal8RMWL);
            }
        }

        private void GenerateGroupHeader(List<string> listColumn, int siteLength, string headerText)
        {
            if (listColumn.Any())
            {
                var mergeCol = listColumn.Count * 4 - (3 - siteLength) * 3;
                var groupVirtualToal = listColumn[0].Split('-');

                this.GroupHeaderList.Add(new GroupHeader
                {
                    HeaderText = groupVirtualToal[0],
                    ColumnName = "Col" + groupVirtualToal[0] + groupVirtualToal[1],
                    MergeColumnNumber = mergeCol
                });
            }            
        }
    }
}