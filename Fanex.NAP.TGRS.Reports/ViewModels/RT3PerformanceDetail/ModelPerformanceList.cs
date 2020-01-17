namespace Fanex.NAP.TGRS.Reports.ViewModels.RT3PerformanceDetail
{
    using Fanex.NAP.TGRS.Reports.Models.RT3PerformanceDetail;
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class ModelPerformanceList
    {
        public ModelPerformanceList()
        {
            ItemList = new List<ModelPerformanceItem>();
            GrandTotal = new ModelPerformanceItem();
        }

        public int LeagueCount { get; set; }

        public int MatchCount { get; set; }

        public List<ModelPerformanceItem> ItemList { get; set; }

        public ModelPerformanceItem GrandTotal { get; set; }

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

        public void AddModelList(IEnumerable<ModelPerformanceInfo> modelInfos)
        {
            foreach (var item in modelInfos)
            {
                var modelItem = new ModelPerformanceItem(item);
                ItemList.Add(modelItem);

                CalculateTotal(modelItem);
            }
        }

        private void CalculateTotal(ModelPerformanceItem item)
        {
            this.GrandTotal.Match += item.Match;
        }
    }
}