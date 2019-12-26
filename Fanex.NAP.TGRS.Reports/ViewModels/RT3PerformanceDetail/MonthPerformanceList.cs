namespace Fanex.NAP.TGRS.Reports.ViewModels.RT3PerformanceDetail
{
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class MonthPerformanceList
    {
        public MonthPerformanceList()
        {
            ItemList = new List<MonthPerformanceItem>();

            GrandTotal = new MonthPerformanceItem();
        }

        public List<MonthPerformanceItem> ItemList { get; set; }

        public MonthPerformanceItem GrandTotal { get; set; }
    }
}