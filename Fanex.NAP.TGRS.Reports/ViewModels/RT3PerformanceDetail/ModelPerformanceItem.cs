namespace Fanex.NAP.TGRS.Reports.ViewModels.RT3PerformanceDetail
{
    using Fanex.NAP.TGRS.Reports.Models.RT3PerformanceDetail;
    using System;

    [Serializable]
    public class ModelPerformanceItem
    {
        public ModelPerformanceItem() { }

        public ModelPerformanceItem(ModelPerformanceInfo modelInfo)
        {
            if (modelInfo != null)
            {
                this.Model = modelInfo.Model;
                this.Match = modelInfo.Match;
                this.MatchPercentage = modelInfo.MatchPercentage;
                this.VirtualTotalTurnover = modelInfo.Stake_VR;
                this.VirtualTotalWinLoss = modelInfo.WinLoss_VR;
                this.VirtualTotalMargin = modelInfo.Margin_VR;
                this.VarianceTurnover = modelInfo.Stake_VAR;
                this.VarianceWinLoss = modelInfo.Winloss_VAR;
                this.VarianceMargin = modelInfo.Margin_VAR;
                this.RealTotalTurnover = modelInfo.Stake_AR;
                this.RealTotalWinLoss = modelInfo.Winloss_AR;
                this.RealTotalMargin = modelInfo.Margin_AR;
                this.Total8RMTurnover = modelInfo.Stake_8RM;
                this.Total8RMWinLoss = modelInfo.Winloss_8RM;
                this.Total8RMMargin = modelInfo.Margin_8RM;
                this.Total8RMWLTurnover = modelInfo.Stake_AR8RM;
                this.Total8RMWLWinLoss = modelInfo.Winloss_AR8RM;
                this.Total8RMWLMargin = modelInfo.Margin_AR8RM;
            }
        }

        public string Model { get; set; }

        public int Match { get; set; }

        public string MatchPercentage { get; set; }

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