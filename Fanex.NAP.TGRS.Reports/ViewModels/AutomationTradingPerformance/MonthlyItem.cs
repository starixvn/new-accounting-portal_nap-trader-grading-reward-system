namespace Fanex.NAP.TGRS.Reports.ViewModels.AutomationTradingPerformance
{
    using Fanex.NAP.TGRS.Core.Consts;
    using Fanex.NAP.TGRS.Reports.Models.AutomationTradingPerformance;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    [Serializable]
    public class MonthlyItem : RobotTradingModelItem
    {
        public MonthlyItem()
        { }

        public MonthlyItem(string monthly, IDictionary<string, string> siteList, IList<MeasurementItem> measurementHiddenList) : base()
        {
            this.Monthly = monthly;
            base.SiteList = siteList;
            base.MeasurementHiddenList = measurementHiddenList;
        }     

        public string Monthly { get; set; }          

        public new MonthlyItem GenerateMatchBetCount(MatchBetCountInfo matchInfo)
        {
            base.GenerateMatchBetCount(matchInfo);

            return this;
        }

        public new MonthlyItem GenereateGroupVirtualTotal(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            base.GenereateGroupVirtualTotal(siteIdList, infos);

            return this;
        }

        public new MonthlyItem GenereateGroupVariance(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            base.GenereateGroupVariance(siteIdList, infos);

            return this;
        }

        public new MonthlyItem GenereateGroupRealTotal(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            base.GenereateGroupRealTotal(siteIdList, infos);

            return this;
        }

        public new MonthlyItem GenereateGroupTotal8RM(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            base.GenereateGroupTotal8RM(siteIdList, infos);

            return this;
        }

        public new MonthlyItem GenereateGroupRealTotal8RMWL(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            base.GenereateGroupRealTotal8RMWL(siteIdList, infos);

            return this;
        }
    }
}