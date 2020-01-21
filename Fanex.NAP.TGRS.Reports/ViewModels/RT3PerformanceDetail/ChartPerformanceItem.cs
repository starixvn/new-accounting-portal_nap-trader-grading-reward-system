namespace Fanex.NAP.TGRS.Reports.ViewModels.RT3PerformanceDetail
{
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class ChartPerformanceItem
    {
        public ChartPerformanceItem()
        {
            RT3WithTrader = new List<decimal>();
            RT3NoTrader = new List<decimal>();
            TradingAutomation = new List<decimal>();
        }     

        public List<decimal> RT3WithTrader { get; set; }

        public List<decimal> RT3NoTrader { get; set; }

        public List<decimal> TradingAutomation { get; set; }

        public void AddTurnover(ModelPerformanceItem item)
        {
            switch (item.ModelName)
            {
                case RT3PerformanceModel.RT3WithTrader:
                    RT3WithTrader.Add(item.VirtualTotalTurnover);
                    RT3WithTrader.Add(item.VarianceTurnover);
                    RT3WithTrader.Add(item.Total8RMWLTurnover);
                    break;
                case RT3PerformanceModel.RT3NoTrader:
                    RT3NoTrader.Add(item.VirtualTotalTurnover);
                    RT3NoTrader.Add(item.VarianceTurnover);
                    RT3NoTrader.Add(item.Total8RMWLTurnover);
                    break;
                case RT3PerformanceModel.TradingAutomation:
                    TradingAutomation.Add(item.VirtualTotalTurnover);
                    TradingAutomation.Add(item.VarianceTurnover);
                    TradingAutomation.Add(item.Total8RMWLTurnover);
                    break;
            }
        }

        public void AddWinLoss(ModelPerformanceItem item)
        {
            switch (item.ModelName)
            {
                case RT3PerformanceModel.RT3WithTrader:
                    RT3WithTrader.Add(item.VirtualTotalWinLoss);
                    RT3WithTrader.Add(item.VarianceWinLoss);
                    RT3WithTrader.Add(item.Total8RMWLWinLoss);
                    break;
                case RT3PerformanceModel.RT3NoTrader:
                    RT3NoTrader.Add(item.VirtualTotalWinLoss);
                    RT3NoTrader.Add(item.VarianceWinLoss);
                    RT3NoTrader.Add(item.Total8RMWLWinLoss);
                    break;
                case RT3PerformanceModel.TradingAutomation:
                    TradingAutomation.Add(item.VirtualTotalWinLoss);
                    TradingAutomation.Add(item.VarianceWinLoss);
                    TradingAutomation.Add(item.Total8RMWLWinLoss);
                    break;
            }
        }

        public void AddMargin(ModelPerformanceItem item)
        {
            switch (item.ModelName)
            {
                case RT3PerformanceModel.RT3WithTrader:
                    RT3WithTrader.Add(item.VirtualTotalMargin);
                    RT3WithTrader.Add(item.VarianceMargin);
                    RT3WithTrader.Add(item.Total8RMWLMargin);
                    break;
                case RT3PerformanceModel.RT3NoTrader:
                    RT3NoTrader.Add(item.VirtualTotalMargin);
                    RT3NoTrader.Add(item.VarianceMargin);
                    RT3NoTrader.Add(item.Total8RMWLMargin);
                    break;
                case RT3PerformanceModel.TradingAutomation:
                    TradingAutomation.Add(item.VirtualTotalMargin);
                    TradingAutomation.Add(item.VarianceMargin);
                    TradingAutomation.Add(item.Total8RMWLMargin);
                    break;
            }
        }
    }
}