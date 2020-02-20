namespace Fanex.NAP.TGRS.Reports.ViewModels.RTModelPerformanceDetail
{
    using Fanex.NAP.TGRS.Reports.Models.RTModelPerformanceDetail;
    using System;

    [Serializable]
    public class MonthPerformanceItem
    {
        public MonthPerformanceItem() { }

        public MonthPerformanceItem(MonthPerformanceInfo monthInfo)
        {
            if (monthInfo != null)
            {
                this.Month = monthInfo.RptMonth.ToString("MMM-yy");
                this.BetCount = monthInfo.BetCount;
                this.Match = monthInfo.MatchCount;                
                this.VirtualTotalTurnover = monthInfo.Stake_VR;
                this.VirtualTotalWinLoss = monthInfo.WinLoss_VR;
                this.VirtualTotalMargin = monthInfo.Margin_VR;
                this.VarianceTurnover = monthInfo.Stake_VAR;
                this.VarianceWinLoss = monthInfo.Winloss_VAR;
                this.VarianceMargin = monthInfo.Margin_VAR;
                this.RealTotalTurnover = monthInfo.Stake_AR;
                this.RealTotalWinLoss = monthInfo.Winloss_AR;
                this.RealTotalMargin = monthInfo.Margin_AR;
                this.Total8RMTurnover = monthInfo.Stake_8RM;
                this.Total8RMWinLoss = monthInfo.Winloss_8RM;
                this.Total8RMMargin = monthInfo.Margin_8RM;
                this.Total8RMWLTurnover = monthInfo.Stake_AR8RM;
                this.Total8RMWLWinLoss = monthInfo.Winloss_AR8RM;
                this.Total8RMWLMargin = monthInfo.Margin_AR8RM;
            }
        }

        public string Month { get; set; }

        public int Match { get; set; }

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