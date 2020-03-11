namespace Fanex.NAP.TGRS.Reports.ViewModels.AutomationTradingPerformance
{    
    using Fanex.NAP.TGRS.Reports.Models.AutomationTradingPerformance;
    using System;
    using System.Collections.Generic;
    
    [Serializable]
    public class PeriodItem : RobotTradingModelItem
    {
        public PeriodItem()
        { }

        public PeriodItem(string period, IDictionary<string, string> siteList, IList<MeasurementItem> measurementHiddenList) : base()
        {
            this.Period = period;
            base.SiteList = siteList;
            base.MeasurementHiddenList = measurementHiddenList;
        }     

        public string Period { get; set; }          

        public new PeriodItem GenerateMatchBetCount(MatchBetCountInfo matchInfo)
        {
            base.GenerateMatchBetCount(matchInfo);

            return this;
        }

        public new PeriodItem GenereateGroupVirtualTotal(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            base.GenereateGroupVirtualTotal(siteIdList, infos);

            return this;
        }

        public new PeriodItem GenereateGroupVariance(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            base.GenereateGroupVariance(siteIdList, infos);

            return this;
        }

        public new PeriodItem GenereateGroupRealTotal(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            base.GenereateGroupRealTotal(siteIdList, infos);

            return this;
        }

        public new PeriodItem GenereateGroupTotal8RM(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            base.GenereateGroupTotal8RM(siteIdList, infos);

            return this;
        }

        public new PeriodItem GenereateGroupRealTotal8RMWL(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            base.GenereateGroupRealTotal8RMWL(siteIdList, infos);

            return this;
        }
    }
}