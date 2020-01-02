namespace Fanex.NAP.TGRS.Reports.ViewModels.RT3PerformanceDetail
{
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.Models.RT3PerformanceDetail;
    using System;   

    [Serializable]
    public class BetTypePerformanceItem
    {        
        public BetTypePerformanceItem() { }

        public BetTypePerformanceItem(BetTypePerformanceInfo betTypeInfo)
        {
            if (betTypeInfo != null)
            {
                this.BetTypeId = betTypeInfo.BetType;
                this.BetTypeName = CacheRef.GetBetType(betTypeInfo.BetType);
                this.BetCount = betTypeInfo.BetCount;
                this.VirtualTotalTurnover = betTypeInfo.Stake_VR;
                this.VirtualTotalWinLoss = betTypeInfo.WinLoss_VR;
                this.VirtualTotalMargin = betTypeInfo.Margin_VR;
                this.VarianceTurnover = betTypeInfo.Stake_VAR;
                this.VarianceWinLoss = betTypeInfo.Winloss_VAR;
                this.VarianceMargin = betTypeInfo.Margin_VAR;
                this.RealTotalTurnover = betTypeInfo.Stake_AR;
                this.RealTotalWinLoss = betTypeInfo.Winloss_AR;
                this.RealTotalMargin = betTypeInfo.Margin_AR;
                this.Total8RMTurnover = betTypeInfo.Stake_8RM;
                this.Total8RMWinLoss = betTypeInfo.Winloss_8RM;
                this.Total8RMMargin = betTypeInfo.Margin_8RM;
                this.Total8RMWLTurnover = betTypeInfo.Stake_AR8RM;
                this.Total8RMWLWinLoss = betTypeInfo.Winloss_AR8RM;
                this.Total8RMWLMargin = betTypeInfo.Margin_AR8RM;
            }
        }

        public short BetTypeId { get; set; }

        public string BetTypeName { get; set; }

        public int BetCount { get; set; }

        public decimal VirtualTotalTurnover { get; set; }

        public decimal VirtualTotalWinLoss { get; set; }

        public decimal VirtualTotalMargin { get; set; }

        public decimal VarianceTurnover { get; set; }

        public decimal VarianceWinLoss { get; set; }

        public decimal VarianceMargin { get; set; }

        public decimal RealTotalTurnover { get; set; }

        public decimal RealTotalWinLoss { get; set; }

        public decimal RealTotalMargin { get; set; }

        public decimal Total8RMTurnover { get; set; }

        public decimal Total8RMWinLoss { get; set; }

        public decimal Total8RMMargin { get; set; }

        public decimal Total8RMWLTurnover { get; set; }

        public decimal Total8RMWLWinLoss { get; set; }

        public decimal Total8RMWLMargin { get; set; }
    }
}