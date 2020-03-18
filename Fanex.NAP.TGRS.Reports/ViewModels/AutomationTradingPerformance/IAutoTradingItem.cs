namespace Fanex.NAP.TGRS.Reports.ViewModels.AutomationTradingPerformance
{
    using Fanex.NAP.TGRS.Reports.Models.AutomationTradingPerformance;    
    using System.Collections.Generic;

    public interface IAutoTradingItem
    {
        IDictionary<string, RobotTradingItem> RobotTradingItemList { get; set; }

        AutoTradingItem GenerateSummary(SummaryLeagueMatchBetCountInfo matchInfo);

        AutoTradingItem GenerateGroupVirtualTotal(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos);

        AutoTradingItem GenerateGroupVariance(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos);

        AutoTradingItem GenerateGroupRealTotal(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos);

        AutoTradingItem GenerateGroupTotal8RM(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos);

        AutoTradingItem GenerateGroupRealTotal8RMWL(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos);

    }
}
