namespace Fanex.NAP.TGRS.Reports.ViewModels.RT3PerformanceDetail
{
    using Fanex.NAP.TGRS.Reports.Models.RT3PerformanceDetail;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    [Serializable]
    public class BetTypePerformanceList
    {
        private List<int> betTypeIdDisplays = new List<int> { 1, 3, 7, 8 };

        public BetTypePerformanceList()
        {
            ItemList = new List<BetTypePerformanceItem>();
            GrandTotal = new BetTypePerformanceItem();
        }

        public List<BetTypePerformanceItem> ItemList { get; set; }

        public int LeagueCount { get; set; }

        public int MatchCount { get; set; }

        public BetTypePerformanceItem GrandTotal { get; set; }

        public void AddGrandTotal(TotalPerformanceInfo totalInfo)
        {
            this.GrandTotal.VirtualTotalTurnover = totalInfo.Total_Stake_VR;
            this.GrandTotal.VirtualTotalWinLoss = totalInfo.Total_WinLoss_VR;
            this.GrandTotal.VirtualTotalMargin = totalInfo.Total_Margin_VR;
            this.GrandTotal.VarianceTurnover = totalInfo.Total_Stake_VAR;
            this.GrandTotal.VarianceWinLoss = totalInfo.Total_Winloss_VAR;
            this.GrandTotal.VarianceMargin = totalInfo.Total_Margin_VAR;
            this.GrandTotal.RealTotalTurnover = totalInfo.Total_Stake_AR;
            this.GrandTotal.RealTotalWinLoss = totalInfo.Total_Winloss_AR;
            this.GrandTotal.RealTotalMargin = totalInfo.Total_Margin_AR;
            this.GrandTotal.Total8RMTurnover = totalInfo.Total_Stake_8RM;
            this.GrandTotal.Total8RMWinLoss = totalInfo.Total_Winloss_8RM;
            this.GrandTotal.Total8RMMargin = totalInfo.Total_Margin_8RM;
            this.GrandTotal.Total8RMWLTurnover = totalInfo.Total_Stake_AR8RM;
            this.GrandTotal.Total8RMWLWinLoss = totalInfo.Total_Winloss_AR8RM;
            this.GrandTotal.Total8RMWLMargin = totalInfo.Total_Margin_AR8RM;
        }

        public void AddLeagueMacthTotal(TotalLeagueMatchInfo totalInfo)
        {
            this.LeagueCount = totalInfo.LeagueCount;
            this.MatchCount = totalInfo.MatchCount;
        }

        public void AddBetTypeList(IEnumerable<BetTypePerformanceInfo> betTypeInfos)
        {
            var items = new List<BetTypePerformanceItem>();
            foreach (var item in betTypeInfos)
            {
                if (betTypeIdDisplays.Contains(item.BetType))
                {
                    var itemBetType = new BetTypePerformanceItem(item);
                    items.Add(itemBetType);

                    CalculateTotal(itemBetType);
                }
            }

            this.ItemList = items.OrderBy(c => c.BetTypeName).ToList();
        }

        private void CalculateTotal(BetTypePerformanceItem item)
        {
            this.GrandTotal.BetCount += item.BetCount;
        }
    }
}