namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail
{
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class BetTypeBetChoiceList
    {
        public BetTypeBetChoiceList()
        {
            ItemList = new List<BetTypeBetChoiceItem>();
        }        

        public bool IsFMBetType { get; set; }

        public List<BetTypeBetChoiceItem> ItemList { get; set; }

        public void AddItem(IEnumerable<BetTypeBetChoicePerformanceInfo> infos)
        {
            foreach (var info in infos)
            {
                if (info != null)
                {
                    this.ItemList.Add(new BetTypeBetChoiceItem(info));
                }
            }            
        }

    }
}
