namespace Fanex.NAP.TGRS.Reports.ViewModels.AutomationTradingPerformance
{
    using Fanex.NAP.TGRS.Reports.Models.AutomationTradingPerformance;
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class GroupingLeagueItem
    {
        public int LeagueGroupId { get; set; }

        public List<SummaryLeagueOfEventInfo> ItemList { get; set; }

    }
}
