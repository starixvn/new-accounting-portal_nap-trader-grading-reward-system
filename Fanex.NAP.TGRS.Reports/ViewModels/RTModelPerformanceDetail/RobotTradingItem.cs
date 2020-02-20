namespace Fanex.NAP.TGRS.Reports.ViewModels.RTModelPerformanceDetail
{
    using System;

    [Serializable]
    public class RobotTradingItem
    {
        public RobotTradingItem() { }

        public string GroupHeaderName { get; set; }        

        public int TypeSideId { get; set; }

        public string TypeSideDesc { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal Margin { get; set; }

        public static RobotTradingItem operator +(RobotTradingItem item1, RobotTradingItem item2)
        {
            if (item1 == null)
                return item2;

            if (item2 == null)
                return item1;

            var sumItem = new RobotTradingItem
            {
                GroupHeaderName = item1.GroupHeaderName,
                TypeSideId = item1.TypeSideId,
                TypeSideDesc = item1.TypeSideDesc,
                Turnover = item1.Turnover + item2.Turnover,
                WinLoss = item1.WinLoss + item2.WinLoss                
            };

            sumItem.Margin = sumItem.Turnover == 0 ? 0 : sumItem.WinLoss / sumItem.Turnover;

            return sumItem;
        }
    }
}