namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class MatchOfBettypeTraderList
    {
        public MatchOfBettypeTraderList()
        {
            this.GroupList = new LinkedList<MatchOfBettypeTraderGroup>();
            this.Total = new MatchOfBettypeTraderItem();
        }

        public int TotalItems { get; set; }

        public ICollection<MatchOfBettypeTraderGroup> GroupList { get; set; }

        public MatchOfBettypeTraderItem Total { get; set; }

        public void AddGroup(MatchOfBettypeTraderGroup group)
        {
            if (group != null)
            {
                this.GroupList.Add(group);
                this.Total.Turnover += group.Total.Turnover;
                this.Total.WinLoss += group.Total.WinLoss;
                this.Total.BetCount += group.Total.BetCount;
            }
        }
    }
}
