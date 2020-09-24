namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class GroupBettypes
    {
        public int GroupId { get; set; }

        public string GroupName { get; set; }        

        public IEnumerable<Bettype> BetTypeList { get; set; }
    }
}
