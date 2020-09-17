namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class GroupBetTypes
    {
        public int GroupId { get; set; }

        public string GroupName { get; set; }

        public int TotalDefaultCheckOfBetTypeList { get; set; }

        public IEnumerable<BetType> BetTypeList { get; set; }
    }
}
