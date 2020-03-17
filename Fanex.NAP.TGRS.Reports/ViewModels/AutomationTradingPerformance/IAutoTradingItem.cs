namespace Fanex.NAP.TGRS.Reports.ViewModels.AutomationTradingPerformance
{
    using Fanex.NAP.TGRS.Reports.Models.AutomationTradingPerformance;    
    using System.Collections.Generic;

    public interface IAutoTradingItem
    {
        IDictionary<string, RobotTradingItem> RobotTradingItemList { get; set; }

        AutoTradingItem GenerateSummary(SummaryLeagueMatchBetCountInfo matchInfo);

        AutoTradingItem GenereateGroupVirtualTotal(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos);

        AutoTradingItem GenereateGroupVariance(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos);

        AutoTradingItem GenereateGroupRealTotal(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos);

        AutoTradingItem GenereateGroupTotal8RM(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos);

        AutoTradingItem GenereateGroupRealTotal8RMWL(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos);
    }
}