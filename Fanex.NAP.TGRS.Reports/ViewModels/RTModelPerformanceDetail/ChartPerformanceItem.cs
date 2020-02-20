namespace Fanex.NAP.TGRS.Reports.ViewModels.RTModelPerformanceDetail
{
    using Fanex.NAP.TGRS.Core.Consts;
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class ChartPerformanceItem
    {        
        public ChartPerformanceItem()
        {
            RT3WithTraderList = new List<decimal>();
            RT3NoTraderList = new List<decimal>();
            TradingAutomationList = new List<decimal>();
        }

        public List<decimal> RT3WithTraderList { get; set; }

        public List<decimal> RT3NoTraderList { get; set; }

        public List<decimal> TradingAutomationList { get; set; }

        public void AddTurnover(ModelPerformanceItem item)
        {
            switch (item.Model)
            {
                case Consts.RT3WithTrader:
                    RT3WithTraderList.Add(item.VirtualTotalTurnover);
                    RT3WithTraderList.Add(item.VarianceTurnover);
                    RT3WithTraderList.Add(item.Total8RMWLTurnover);
                    break;
                case Consts.RT3NoTrader:
                    RT3NoTraderList.Add(item.VirtualTotalTurnover);
                    RT3NoTraderList.Add(item.VarianceTurnover);
                    RT3NoTraderList.Add(item.Total8RMWLTurnover);
                    break;
                case Consts.TradingAutomation:
                    TradingAutomationList.Add(item.VirtualTotalTurnover);
                    TradingAutomationList.Add(item.VarianceTurnover);
                    TradingAutomationList.Add(item.Total8RMWLTurnover);
                    break;
            }
        }

        public void AddWinLoss(ModelPerformanceItem item)
        {
            switch (item.Model)
            {
                case Consts.RT3WithTrader:
                    RT3WithTraderList.Add(item.VirtualTotalWinLoss);
                    RT3WithTraderList.Add(item.VarianceWinLoss);
                    RT3WithTraderList.Add(item.Total8RMWLWinLoss);
                    break;
                case Consts.RT3NoTrader:
                    RT3NoTraderList.Add(item.VirtualTotalWinLoss);
                    RT3NoTraderList.Add(item.VarianceWinLoss);
                    RT3NoTraderList.Add(item.Total8RMWLWinLoss);
                    break;
                case Consts.TradingAutomation:
                    TradingAutomationList.Add(item.VirtualTotalWinLoss);
                    TradingAutomationList.Add(item.VarianceWinLoss);
                    TradingAutomationList.Add(item.Total8RMWLWinLoss);
                    break;
            }
        }

        public void AddMargin(ModelPerformanceItem item)
        {
            switch (item.Model)
            {
                case Consts.RT3WithTrader:
                    RT3WithTraderList.Add(item.VirtualTotalMargin);
                    RT3WithTraderList.Add(item.VarianceMargin);
                    RT3WithTraderList.Add(item.Total8RMWLMargin);
                    break;
                case Consts.RT3NoTrader:
                    RT3NoTraderList.Add(item.VirtualTotalMargin);
                    RT3NoTraderList.Add(item.VarianceMargin);
                    RT3NoTraderList.Add(item.Total8RMWLMargin);
                    break;
                case Consts.TradingAutomation:
                    TradingAutomationList.Add(item.VirtualTotalMargin);
                    TradingAutomationList.Add(item.VarianceMargin);
                    TradingAutomationList.Add(item.Total8RMWLMargin);
                    break;
            }
        }
    }
}