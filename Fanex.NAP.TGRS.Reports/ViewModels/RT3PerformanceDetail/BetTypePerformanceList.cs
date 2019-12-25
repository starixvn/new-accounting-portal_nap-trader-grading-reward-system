namespace Fanex.NAP.TGRS.Reports.ViewModels.RT3PerformanceDetail
{
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class BetTypePerformanceList
    {
        public BetTypePerformanceList()
        {
            ItemList = new List<BetTypePerformanceItem>();
            GrandTotal = new BetTypePerformanceItem();
        }

        public List<BetTypePerformanceItem> ItemList { get; set; }

        public BetTypePerformanceItem GrandTotal { get; set; }
    }
}