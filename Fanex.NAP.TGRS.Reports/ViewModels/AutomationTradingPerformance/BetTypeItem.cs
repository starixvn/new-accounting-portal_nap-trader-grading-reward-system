namespace Fanex.NAP.TGRS.Reports.ViewModels.AutomationTradingPerformance
{
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.Models.AutomationTradingPerformance;
    using System;
    using System.Collections.Generic;    

    [Serializable]
    public class BetTypeItem : RobotTradingModelItem
    {
        public BetTypeItem()
        { }

        public BetTypeItem(short betTypeId, IDictionary<string, string> siteList, IList<MeasurementItem> measurementHiddenList) : base ()
        {
            this.BetTypeId = betTypeId;
            this.BetTypeName = CacheRef.GetBetType(betTypeId);
            base.SiteList = siteList;
            base.MeasurementHiddenList = measurementHiddenList;
        }        

        public short BetTypeId { get; set; }

        public string BetTypeName { get; set; }
        
        public new BetTypeItem GenerateMatchBetCount(MatchBetCountInfo matchInfo)
        {
            base.GenerateMatchBetCount(matchInfo);

            return this;
        }

        public new BetTypeItem GenereateGroupVirtualTotal(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            base.GenereateGroupVirtualTotal(siteIdList, infos);

            return this;
        }

        public new BetTypeItem GenereateGroupVariance(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            base.GenereateGroupVariance(siteIdList, infos);

            return this;
        }

        public new BetTypeItem GenereateGroupRealTotal(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            base.GenereateGroupRealTotal(siteIdList, infos);

            return this;
        }

        public new BetTypeItem GenereateGroupTotal8RM(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            base.GenereateGroupTotal8RM(siteIdList, infos);

            return this;
        }

        public new BetTypeItem GenereateGroupRealTotal8RMWL(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            base.GenereateGroupRealTotal8RMWL(siteIdList, infos);

            return this;
        }
    }
}