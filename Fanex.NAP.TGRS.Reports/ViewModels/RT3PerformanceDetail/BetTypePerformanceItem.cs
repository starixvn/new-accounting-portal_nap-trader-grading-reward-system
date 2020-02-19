namespace Fanex.NAP.TGRS.Reports.ViewModels.RT3PerformanceDetail
{
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.Models.RT3PerformanceDetail;
    using System;
    using System.Collections.Generic;    

    [Serializable]
    public class BetTypePerformanceItem
    {        
        public BetTypePerformanceItem() { }

        public BetTypePerformanceItem(IEnumerable<BetTypePerformanceInfo> betTypeInfos)
        {
            foreach (var item in betTypeInfos)
            {
                this.BetTypeId = item.BetType;
                this.BetTypeName = CacheRef.GetBetType(item.BetType);
                this.MatchCount += item.MatchCount;
                this.BetCount += item.BetCount;
                this.VirtualTotalTurnover += item.Stake_VR;
                this.VirtualTotalWinLoss += item.WinLoss_VR;
                this.VirtualTotalMargin += item.Margin_VR;
                this.VarianceTurnover += item.Stake_VAR;
                this.VarianceWinLoss += item.Winloss_VAR;
                this.VarianceMargin += item.Margin_VAR;
                this.RealTotalTurnover += item.Stake_AR;
                this.RealTotalWinLoss += item.Winloss_AR;
                this.RealTotalMargin += item.Margin_AR;
                this.Total8RMTurnover += item.Stake_8RM;
                this.Total8RMWinLoss += item.Winloss_8RM;
                this.Total8RMMargin += item.Margin_8RM;
                this.Total8RMWLTurnover += item.Stake_AR8RM;
                this.Total8RMWLWinLoss += item.Winloss_AR8RM;
                this.Total8RMWLMargin += item.Margin_AR8RM;
            }
        }

        public BetTypePerformanceItem BindingSiteCN88(BetTypePerformanceInfo betTypeInfo)
        {
            if (betTypeInfo.TypeSiteId == 1)
            {
                this.NovaVirtualTotalTurnover = betTypeInfo.Stake_VR;
                this.NovaVirtualTotalWinLoss = betTypeInfo.WinLoss_VR;
                this.NovaVirtualTotalMargin = betTypeInfo.Margin_VR;
                this.NovaVarianceTurnover = betTypeInfo.Stake_VAR;
                this.NovaVarianceWinLoss = betTypeInfo.Winloss_VAR;
                this.NovaVarianceMargin = betTypeInfo.Margin_VAR;
                this.NovaRealTotalTurnover = betTypeInfo.Stake_AR;
                this.NovaRealTotalWinLoss = betTypeInfo.Winloss_AR;
                this.NovaRealTotalMargin = betTypeInfo.Margin_AR;
                this.NovaTotal8RMTurnover = betTypeInfo.Stake_8RM;
                this.NovaTotal8RMWinLoss = betTypeInfo.Winloss_8RM;
                this.NovaTotal8RMMargin = betTypeInfo.Margin_8RM;
                this.NovaRealTotal8RMWLTurnover = betTypeInfo.Stake_AR8RM;
                this.NovaRealTotal8RMWLWinLoss = betTypeInfo.Winloss_AR8RM;
                this.NovaTotal8RMWLMargin = betTypeInfo.Margin_AR8RM;
            }

            return this;
        }

        public BetTypePerformanceItem BindingSiteCash(BetTypePerformanceInfo betTypeInfo)
        {
            if (betTypeInfo.TypeSiteId == 2)
            {
                this.CashVirtualTotalTurnover = betTypeInfo.Stake_VR;
                this.CashVirtualTotalWinLoss = betTypeInfo.WinLoss_VR;
                this.CashVirtualTotalMargin = betTypeInfo.Margin_VR;
                this.CashVarianceTurnover = betTypeInfo.Stake_VAR;
                this.CashVarianceWinLoss = betTypeInfo.Winloss_VAR;
                this.CashVarianceMargin = betTypeInfo.Margin_VAR;
                this.CashRealTotalTurnover = betTypeInfo.Stake_AR;
                this.CashRealTotalWinLoss = betTypeInfo.Winloss_AR;
                this.CashRealTotalMargin = betTypeInfo.Margin_AR;
                this.CashTotal8RMTurnover = betTypeInfo.Stake_8RM;
                this.CashTotal8RMWinLoss = betTypeInfo.Winloss_8RM;
                this.CashTotal8RMMargin = betTypeInfo.Margin_8RM;
                this.CashRealTotal8RMWLTurnover = betTypeInfo.Stake_AR8RM;
                this.CashRealTotal8RMWLWinLoss = betTypeInfo.Winloss_AR8RM;
                this.CashTotal8RMWLMargin = betTypeInfo.Margin_AR8RM;
            }

            return this;
        }

        public BetTypePerformanceItem BindingSiteNova(BetTypePerformanceInfo betTypeInfo)
        {
            if (betTypeInfo.TypeSiteId == 3)
            {
                this.CN88VirtualTotalTurnover = betTypeInfo.Stake_VR;
                this.CN88VirtualTotalWinLoss = betTypeInfo.WinLoss_VR;
                this.CN88VirtualTotalMargin = betTypeInfo.Margin_VR;
                this.CN88VarianceTurnover = betTypeInfo.Stake_VAR;
                this.CN88VarianceWinLoss = betTypeInfo.Winloss_VAR;
                this.CN88VarianceMargin = betTypeInfo.Margin_VAR;
                this.CN88RealTotalTurnover = betTypeInfo.Stake_AR;
                this.CN88RealTotalWinLoss = betTypeInfo.Winloss_AR;
                this.CN88RealTotalMargin = betTypeInfo.Margin_AR;
                this.CN88Total8RMTurnover = betTypeInfo.Stake_8RM;
                this.CN88Total8RMWinLoss = betTypeInfo.Winloss_8RM;
                this.CN88Total8RMMargin = betTypeInfo.Margin_8RM;
                this.CN88RealTotal8RMWLTurnover = betTypeInfo.Stake_AR8RM;
                this.CN88RealTotal8RMWLWinLoss = betTypeInfo.Winloss_AR8RM;
                this.CN88Total8RMWLMargin = betTypeInfo.Margin_AR8RM;
            }

            return this;
        }

        public short BetTypeId { get; set; }

        public string BetTypeName { get; set; }

        public int MatchCount { get; set; }

        public int BetCount { get; set; }


        /* Virtual */
        public decimal NovaVirtualTotalTurnover { get; set; }

        public decimal NovaVirtualTotalWinLoss { get; set; }

        public decimal NovaVirtualTotalMargin { get; set; }

        public decimal CashVirtualTotalTurnover { get; set; }

        public decimal CashVirtualTotalWinLoss { get; set; }

        public decimal CashVirtualTotalMargin { get; set; }

        public decimal CN88VirtualTotalTurnover { get; set; }

        public decimal CN88VirtualTotalWinLoss { get; set; }

        public decimal CN88VirtualTotalMargin { get; set; }

        public decimal VirtualTotalTurnover { get; set; }

        public decimal VirtualTotalWinLoss { get; set; }

        public decimal VirtualTotalMargin { get; set; }


        /* Variance */
        public decimal NovaVarianceTurnover { get; set; }

        public decimal NovaVarianceWinLoss { get; set; }

        public decimal NovaVarianceMargin { get; set; }

        public decimal CashVarianceTurnover { get; set; }

        public decimal CashVarianceWinLoss { get; set; }

        public decimal CashVarianceMargin { get; set; }

        public decimal CN88VarianceTurnover { get; set; }

        public decimal CN88VarianceWinLoss { get; set; }

        public decimal CN88VarianceMargin { get; set; }

        public decimal VarianceTurnover { get; set; }

        public decimal VarianceWinLoss { get; set; }

        public decimal VarianceMargin { get; set; }


        /* Real Total */
        public decimal NovaRealTotalTurnover { get; set; }

        public decimal NovaRealTotalWinLoss { get; set; }

        public decimal NovaRealTotalMargin { get; set; }

        public decimal CashRealTotalTurnover { get; set; }

        public decimal CashRealTotalWinLoss { get; set; }

        public decimal CashRealTotalMargin { get; set; }

        public decimal CN88RealTotalTurnover { get; set; }

        public decimal CN88RealTotalWinLoss { get; set; }

        public decimal CN88RealTotalMargin { get; set; }

        public decimal RealTotalTurnover { get; set; }

        public decimal RealTotalWinLoss { get; set; }

        public decimal RealTotalMargin { get; set; }


        /* Total 8RM */
        public decimal NovaTotal8RMTurnover { get; set; }

        public decimal NovaTotal8RMWinLoss { get; set; }

        public decimal NovaTotal8RMMargin { get; set; }

        public decimal CashTotal8RMTurnover { get; set; }

        public decimal CashTotal8RMWinLoss { get; set; }

        public decimal CashTotal8RMMargin { get; set; }

        public decimal CN88Total8RMTurnover { get; set; }

        public decimal CN88Total8RMWinLoss { get; set; }

        public decimal CN88Total8RMMargin { get; set; }
       
        public decimal Total8RMTurnover { get; set; }

        public decimal Total8RMWinLoss { get; set; }

        public decimal Total8RMMargin { get; set; }


        /* Total 8RM */
        public decimal NovaRealTotal8RMWLTurnover { get; set; }

        public decimal NovaRealTotal8RMWLWinLoss { get; set; }

        public decimal NovaTotal8RMWLMargin { get; set; }

        public decimal CashRealTotal8RMWLTurnover { get; set; }

        public decimal CashRealTotal8RMWLWinLoss { get; set; }

        public decimal CashTotal8RMWLMargin { get; set; }

        public decimal CN88RealTotal8RMWLTurnover { get; set; }

        public decimal CN88RealTotal8RMWLWinLoss { get; set; }

        public decimal CN88Total8RMWLMargin { get; set; }

        public decimal Total8RMWLTurnover { get; set; }

        public decimal Total8RMWLWinLoss { get; set; }

        public decimal Total8RMWLMargin { get; set; }

    }
}