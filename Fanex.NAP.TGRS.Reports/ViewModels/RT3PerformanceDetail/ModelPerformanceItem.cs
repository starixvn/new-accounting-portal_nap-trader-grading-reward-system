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
                this.ModelName = modelInfo.ModelName;
                this.Model = modelInfo.Model;
                this.Match = modelInfo.Match;
                this.BetCount = modelInfo.BetCount;
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

        private decimal ConvertNumberToPercentage(decimal valueItem, decimal valueTotal)
        {
            return Math.Round((valueItem / valueTotal) * 100, 2);
        }

        public void ConvertNumberToPercentage(ModelPerformanceItem total)
        {
            this.Match = ConvertNumberToPercentage(this.Match, total.Match);
            this.BetCount = ConvertNumberToPercentage(this.BetCount, total.BetCount);
            this.VirtualTotalTurnover = ConvertNumberToPercentage(this.VirtualTotalTurnover, total.VirtualTotalTurnover);
            this.VirtualTotalWinLoss = ConvertNumberToPercentage(this.VirtualTotalWinLoss, total.VirtualTotalWinLoss);           
            this.VarianceTurnover = ConvertNumberToPercentage(this.VarianceTurnover, total.VarianceTurnover);
            this.VarianceWinLoss = ConvertNumberToPercentage(this.VarianceWinLoss, total.VarianceWinLoss);        
            this.RealTotalTurnover = ConvertNumberToPercentage(this.RealTotalTurnover, total.RealTotalTurnover);
            this.RealTotalWinLoss = ConvertNumberToPercentage(this.RealTotalWinLoss, total.RealTotalWinLoss);         
            this.Total8RMTurnover = ConvertNumberToPercentage(this.Total8RMTurnover, total.Total8RMTurnover);
            this.Total8RMWinLoss = ConvertNumberToPercentage(this.Total8RMWinLoss, total.Total8RMWinLoss);          
            this.Total8RMWLTurnover = ConvertNumberToPercentage(this.Total8RMWLTurnover, total.Total8RMWLTurnover);
            this.Total8RMWLWinLoss = ConvertNumberToPercentage(this.Total8RMWLWinLoss, total.Total8RMWLWinLoss);          
        }

        public RT3PerformanceModel ModelName { get; set; }

        public string Model { get; set; }

        public decimal Match { get; set; }

        public decimal BetCount { get; set; }

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