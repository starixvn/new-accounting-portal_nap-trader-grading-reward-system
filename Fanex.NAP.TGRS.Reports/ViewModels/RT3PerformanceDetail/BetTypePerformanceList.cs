namespace Fanex.NAP.TGRS.Reports.ViewModels.RT3PerformanceDetail
{
    using Fanex.NAP.TGRS.Reports.Models.RT3PerformanceDetail;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    [Serializable]
    public class BetTypePerformanceList
    {
        private List<int> betTypeIdsDisplay = new List<int> { 1, 3, 7, 8 };

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

        public void AddBetTypeList(IEnumerable<BetTypePerformanceInfo> betTypeInfos, string[] siteIds)
        {
            var items = new List<BetTypePerformanceItem>();

            for (int i = 0; i < betTypeIdsDisplay.Count; i++)
            {
                var siteBetTypeInfos = betTypeInfos.Where(x => betTypeIdsDisplay[i] == x.BetType && siteIds.Contains(x.TypeSiteId.ToString()));

                var siteBetTypeItem = new BetTypePerformanceItem(siteBetTypeInfos);
                
                foreach (var item in siteBetTypeInfos)
                {
                    siteBetTypeItem
                        .BindingSiteCN88(item)
                        .BindingSiteCash(item)
                        .BindingSiteNova(item);
                }

                items.Add(siteBetTypeItem);
                CalculateTotal(siteBetTypeItem);
            }

            this.ItemList = items.OrderBy(c => c.BetTypeName).ToList();

            this.GrandTotal.NovaVirtualTotalMargin = this.CalculateTotalMargin(this.GrandTotal.NovaVirtualTotalWinLoss, this.GrandTotal.NovaVirtualTotalTurnover);
            this.GrandTotal.CashVirtualTotalMargin = this.CalculateTotalMargin(this.GrandTotal.CashVirtualTotalWinLoss, this.GrandTotal.CashVirtualTotalTurnover);
            this.GrandTotal.CN88VirtualTotalMargin = this.CalculateTotalMargin(this.GrandTotal.CN88VirtualTotalWinLoss, this.GrandTotal.CN88VirtualTotalTurnover);

            this.GrandTotal.NovaVarianceMargin = this.CalculateTotalMargin(this.GrandTotal.NovaVarianceWinLoss, this.GrandTotal.NovaVarianceTurnover);
            this.GrandTotal.CashVarianceMargin = this.CalculateTotalMargin(this.GrandTotal.CashVarianceWinLoss, this.GrandTotal.CashVarianceTurnover);
            this.GrandTotal.CN88VarianceMargin = this.CalculateTotalMargin(this.GrandTotal.CN88VarianceWinLoss, this.GrandTotal.CN88VarianceTurnover);

            this.GrandTotal.NovaRealTotalMargin = this.CalculateTotalMargin(this.GrandTotal.NovaRealTotalWinLoss, this.GrandTotal.NovaRealTotalTurnover);
            this.GrandTotal.CashRealTotalMargin = this.CalculateTotalMargin(this.GrandTotal.CashRealTotalWinLoss, this.GrandTotal.CashRealTotalTurnover);
            this.GrandTotal.CN88RealTotalMargin = this.CalculateTotalMargin(this.GrandTotal.CN88RealTotalWinLoss, this.GrandTotal.CN88RealTotalTurnover);

            this.GrandTotal.NovaTotal8RMMargin = this.CalculateTotalMargin(this.GrandTotal.NovaTotal8RMWinLoss, this.GrandTotal.NovaTotal8RMTurnover);
            this.GrandTotal.CashTotal8RMMargin = this.CalculateTotalMargin(this.GrandTotal.CashTotal8RMWinLoss, this.GrandTotal.CashTotal8RMTurnover);
            this.GrandTotal.CN88Total8RMMargin = this.CalculateTotalMargin(this.GrandTotal.CN88Total8RMWinLoss, this.GrandTotal.CN88Total8RMTurnover);

            this.GrandTotal.NovaTotal8RMWLMargin = this.CalculateTotalMargin(this.GrandTotal.NovaRealTotal8RMWLWinLoss, this.GrandTotal.NovaRealTotal8RMWLTurnover);
            this.GrandTotal.CashTotal8RMWLMargin = this.CalculateTotalMargin(this.GrandTotal.CashRealTotal8RMWLWinLoss, this.GrandTotal.CashRealTotal8RMWLTurnover);
            this.GrandTotal.CN88Total8RMWLMargin = this.CalculateTotalMargin(this.GrandTotal.CN88RealTotal8RMWLWinLoss, this.GrandTotal.CN88RealTotal8RMWLTurnover);
        }

        private void CalculateTotal(BetTypePerformanceItem item)
        {
            this.GrandTotal.NovaVirtualTotalTurnover += item.NovaVirtualTotalTurnover;
            this.GrandTotal.NovaVirtualTotalWinLoss += item.NovaVirtualTotalWinLoss;
            this.GrandTotal.CashVirtualTotalTurnover += item.CashVirtualTotalTurnover;
            this.GrandTotal.CashVirtualTotalWinLoss += item.CashVirtualTotalWinLoss;            
            this.GrandTotal.CN88VirtualTotalTurnover += item.CN88VirtualTotalTurnover;
            this.GrandTotal.CN88VirtualTotalWinLoss += item.CN88VirtualTotalWinLoss;

            this.GrandTotal.NovaVarianceTurnover += item.NovaVarianceTurnover;
            this.GrandTotal.NovaVarianceWinLoss += item.NovaVarianceWinLoss;
            this.GrandTotal.CashVarianceTurnover += item.CashVarianceTurnover;
            this.GrandTotal.CashVarianceWinLoss += item.CashVarianceWinLoss;
            this.GrandTotal.CN88VarianceTurnover += item.CN88VarianceTurnover;
            this.GrandTotal.CN88VarianceWinLoss += item.CN88VarianceWinLoss;

            this.GrandTotal.NovaRealTotalTurnover += item.NovaRealTotalTurnover;
            this.GrandTotal.NovaRealTotalWinLoss += item.NovaRealTotalWinLoss;
            this.GrandTotal.CashRealTotalTurnover += item.CashRealTotalTurnover;
            this.GrandTotal.CashRealTotalWinLoss += item.CashRealTotalWinLoss;
            this.GrandTotal.CN88RealTotalTurnover += item.CN88RealTotalTurnover;
            this.GrandTotal.CN88RealTotalWinLoss += item.CN88RealTotalWinLoss;

            this.GrandTotal.NovaTotal8RMTurnover += item.NovaTotal8RMTurnover;
            this.GrandTotal.NovaTotal8RMWinLoss += item.NovaTotal8RMWinLoss;
            this.GrandTotal.CashTotal8RMTurnover += item.CashTotal8RMTurnover;
            this.GrandTotal.CashTotal8RMWinLoss += item.CashTotal8RMWinLoss;
            this.GrandTotal.CN88Total8RMTurnover += item.CN88Total8RMTurnover;
            this.GrandTotal.CN88Total8RMWinLoss += item.CN88Total8RMWinLoss;

            this.GrandTotal.NovaRealTotal8RMWLTurnover += item.NovaRealTotal8RMWLTurnover;
            this.GrandTotal.NovaRealTotal8RMWLWinLoss += item.NovaRealTotal8RMWLWinLoss;
            this.GrandTotal.CashRealTotal8RMWLTurnover += item.CashRealTotal8RMWLTurnover;
            this.GrandTotal.CashRealTotal8RMWLWinLoss += item.CashRealTotal8RMWLWinLoss;
            this.GrandTotal.CN88RealTotal8RMWLTurnover += item.CN88RealTotal8RMWLTurnover;
            this.GrandTotal.CN88RealTotal8RMWLWinLoss += item.CN88RealTotal8RMWLWinLoss;

            this.GrandTotal.BetCount += item.BetCount;
            this.GrandTotal.MatchCount += item.MatchCount;
        }

        private decimal CalculateTotalMargin(decimal winLoss, decimal turnover)
        {
            if (turnover != 0)
            {
                return winLoss / turnover * 100;
            }

            return 0;
        }
    }
}