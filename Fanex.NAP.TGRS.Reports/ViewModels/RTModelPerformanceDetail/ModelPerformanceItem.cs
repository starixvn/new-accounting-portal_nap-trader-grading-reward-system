namespace Fanex.NAP.TGRS.Reports.ViewModels.RTModelPerformanceDetail
{
    using Fanex.NAP.TGRS.Core.Consts;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Models.RTModelPerformanceDetail;
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
                this.MatchCount = modelInfo.MatchCount;
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
            if (valueTotal != 0)
            {
                return Math.Round((valueItem / valueTotal) * 100, 2);
            }

            return 0;
        }

        public ModelPerformanceItem ConvertNumberToPercentage(ModelPerformanceItem total)
        {
            var newItem = new ModelPerformanceItem();

            newItem.Model = this.Model;
            newItem.MatchCount = ConvertNumberToPercentage(this.MatchCount, total.MatchCount);
            newItem.BetCount = ConvertNumberToPercentage(this.BetCount, total.BetCount);
            newItem.VirtualTotalTurnover = ConvertNumberToPercentage(this.VirtualTotalTurnover, total.VirtualTotalTurnover);
            newItem.VirtualTotalWinLoss = ConvertNumberToPercentage(this.VirtualTotalWinLoss, total.VirtualTotalWinLoss);
            newItem.VirtualTotalMargin = Math.Round(this.VirtualTotalMargin, 2);
            newItem.VarianceTurnover = ConvertNumberToPercentage(this.VarianceTurnover, total.VarianceTurnover);
            newItem.VarianceWinLoss = ConvertNumberToPercentage(this.VarianceWinLoss, total.VarianceWinLoss);
            newItem.VarianceMargin = Math.Round(this.VarianceMargin, 2);
            newItem.RealTotalTurnover = ConvertNumberToPercentage(this.RealTotalTurnover, total.RealTotalTurnover);
            newItem.RealTotalWinLoss = ConvertNumberToPercentage(this.RealTotalWinLoss, total.RealTotalWinLoss);
            newItem.RealTotalMargin = Math.Round(this.RealTotalMargin, 2);
            newItem.Total8RMTurnover = ConvertNumberToPercentage(this.Total8RMTurnover, total.Total8RMTurnover);
            newItem.Total8RMWinLoss = ConvertNumberToPercentage(this.Total8RMWinLoss, total.Total8RMWinLoss);
            newItem.Total8RMMargin = Math.Round(this.Total8RMMargin, 2);
            newItem.Total8RMWLTurnover = ConvertNumberToPercentage(this.Total8RMWLTurnover, total.Total8RMWLTurnover);
            newItem.Total8RMWLWinLoss = ConvertNumberToPercentage(this.Total8RMWLWinLoss, total.Total8RMWLWinLoss);
            newItem.Total8RMWLMargin = Math.Round(this.Total8RMWLMargin, 2);

            return newItem;
        }

        public string ModelName
        {
            get
            {
                switch (this.Model)
                {
                    case Consts.RT3WithTrader:
                        return ViewLang.RT3WithTraderPerformance;
                    case Consts.RT3NoTrader:
                        return ViewLang.RT3NoTraderPerformance;
                    case Consts.TradingAutomation:
                        return ViewLang.TradingAutomation;
                    default:
                        return string.Empty;
                }
            }
        }

        public string Model { get; set; }

        public decimal MatchCount { get; set; }

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