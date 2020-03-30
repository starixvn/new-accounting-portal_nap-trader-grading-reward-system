namespace Fanex.NAP.TGRS.Reports.ViewModels.AutomationTradingPerformance
{
    using Fanex.NAP.TGRS.Core.Consts;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    [Serializable]
    public class RobotTradingItem
    {
        public RobotTradingItem()
        {            
        }      

        public RobotTradingItem(string groupHeaderName, int typeSiteId, string typeSiteDesc, IEnumerable<MeasurementItem> measurementHiddenList)
        {
            this.GroupHeaderName = groupHeaderName;
            this.TypeSiteId = typeSiteId;
            this.TypeSiteDesc = typeSiteDesc;
            this.IsHideTurnover = measurementHiddenList.Where(x => x.Measurement == "Turnover").Any();
            this.IsHideWinLoss = measurementHiddenList.Where(x => x.Measurement == "WinLoss").Any();
            this.IsHideMargin = measurementHiddenList.Where(x => x.Measurement == "Margin").Any();
            this.SetCssClass();
        }

        public string GroupHeaderName { get; set; }        

        public int TypeSiteId { get; set; }

        public string TypeSiteDesc { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal Margin { get; set; }

        public bool IsHideTurnover { get; set; }

        public bool IsHideWinLoss { get; set; }

        public bool IsHideMargin { get; set; }

        public string CssClass { get; set; }

        public string CssClassTOWL { get; set; }

        public string CssClassMargin { get; set; }

        public void SetCssClass()
        {
            switch (this.TypeSiteId)
            {
                case 1:
                    this.CssClassTOWL = Consts.AutomationTradingCssClassBodyCn88TOWL;
                    this.CssClassMargin = Consts.AutomationTradingCssClassBodyNovaMargin;
                    break;
                case 2:
                    this.CssClassTOWL = Consts.AutomationTradingCssClassBodyCashTOWL;
                    this.CssClassMargin = Consts.AutomationTradingCssClassBodyCashMargin;
                    break;
                case 3:
                    this.CssClassTOWL = Consts.AutomationTradingCssClassBodyNovaTOWL;
                    this.CssClassMargin = Consts.AutomationTradingCssClassBodyNovaMargin;
                    break;
                default:
                    this.CssClassTOWL = string.Empty;
                    this.CssClassMargin = string.Empty;
                    break;
            }
        }
      
        public static RobotTradingItem operator +(RobotTradingItem item1, RobotTradingItem item2)
        {
            if (item1 == null)
                return item2;

            if (item2 == null)
                return item1;

            var sumItem = new RobotTradingItem
            {
                GroupHeaderName = item1.GroupHeaderName,
                TypeSiteId = item1.TypeSiteId,
                TypeSiteDesc = item1.TypeSiteDesc,
                Turnover = item1.Turnover + item2.Turnover,
                WinLoss = item1.WinLoss + item2.WinLoss,
                IsHideTurnover = item1.IsHideTurnover,
                IsHideWinLoss = item1.IsHideWinLoss,
                IsHideMargin = item1.IsHideMargin,
                CssClass = item1.CssClass
            };            

            sumItem.Margin = sumItem.Turnover == 0 ? 0 : (sumItem.WinLoss / sumItem.Turnover) * 100;

            switch (sumItem.TypeSiteId)
            {
                case 1:
                    sumItem.CssClass = Consts.AutomationTradingCssClassDimCn88;
                    break;
                case 2:
                    sumItem.CssClass = Consts.AutomationTradingCssClassDimCash;
                    break;
                case 3:
                    sumItem.CssClass = Consts.AutomationTradingCssClassDimNova;
                    break;
                default:
                    sumItem.CssClass = Consts.AutomationTradingCssClassDim;
                    break;
            }

            return sumItem;
        }

    }
}