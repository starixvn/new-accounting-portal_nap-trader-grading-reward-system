namespace Fanex.NAP.TGRS.Reports.ViewModels.RT3PerformanceDetail
{
    using Fanex.NAP.TGRS.Core.Consts;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.Models.RT3PerformanceDetail;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    [Serializable]
    public class BetTypeItem
    {
        public BetTypeItem()
        {
            RobotTradingItemList = new Dictionary<string, RobotTradingItem>();
        }

        public BetTypeItem(short betTypeId) : this ()
        {
            this.BetTypeId = betTypeId;
            this.BetTypeName = CacheRef.GetBetType(betTypeId);           
        }

        public short BetTypeId { get; set; }

        public string BetTypeName { get; set; }

        public int MatchCount { get; set; }

        public int BetCount { get; set; }

        public IDictionary<string, RobotTradingItem> RobotTradingItemList { get; set; }

        public BetTypeItem GenerateMatchBetCount(IEnumerable<BetTypePerformanceInfo> betTypeInfos)
        {
            foreach (var info in betTypeInfos)
            {
                this.MatchCount += info.MatchCount;
                this.BetCount += info.BetCount;
            }

            return this;
        }

        public BetTypeItem GenereateGroupVirtualTotal(IEnumerable<BetTypePerformanceInfo> betTypeInfos)
        {
            var sumItem = new RobotTradingItem
            {
                GroupHeaderName = Consts.RobotTradingGroupHeaderVirtualTotal,
                TypeSideId = 0,
                TypeSideDesc = string.Empty,
                Turnover = betTypeInfos.Sum(x => x.Stake_VR),
                WinLoss = betTypeInfos.Sum(x => x.WinLoss_VR)                
            };
            sumItem.Margin = sumItem.Turnover == 0 ? 0 : sumItem.WinLoss / sumItem.Turnover;

            foreach (var info in betTypeInfos)
            {
                var robotTradingItem = new RobotTradingItem {
                    GroupHeaderName = Consts.RobotTradingGroupHeaderVirtualTotal,
                    TypeSideId = info.TypeSiteId,
                    TypeSideDesc = info.TypeSiteDesc,
                    Turnover = info.Stake_VR,
                    WinLoss = info.WinLoss_VR,
                    Margin = info.Margin_VR
                };
              
                this.RobotTradingItemList.Add(robotTradingItem.GroupHeaderName + robotTradingItem.TypeSideDesc, robotTradingItem);
            }

            this.RobotTradingItemList.Add(Consts.RobotTradingGroupHeaderVirtualTotal, sumItem);

            return this;
        }

        public BetTypeItem GenereateGroupVariance(IEnumerable<BetTypePerformanceInfo> betTypeInfos)
        {
            var sumItem = new RobotTradingItem
            {
                GroupHeaderName = Consts.RobotTradingGroupHeaderVariance,
                TypeSideId = 0,
                TypeSideDesc = string.Empty,
                Turnover = betTypeInfos.Sum(x => x.Stake_VAR),
                WinLoss = betTypeInfos.Sum(x => x.Winloss_VAR)                
            };
            sumItem.Margin = sumItem.Turnover == 0 ? 0 : sumItem.WinLoss / sumItem.Turnover;

            foreach (var info in betTypeInfos)
            {
                var robotTradingItem = new RobotTradingItem
                {
                    GroupHeaderName = Consts.RobotTradingGroupHeaderVariance,
                    TypeSideId = info.TypeSiteId,
                    TypeSideDesc = info.TypeSiteDesc,
                    Turnover = info.Stake_VAR,
                    WinLoss = info.Winloss_VAR,
                    Margin = info.Margin_VAR
                };              

                this.RobotTradingItemList.Add(robotTradingItem.GroupHeaderName + robotTradingItem.TypeSideDesc, robotTradingItem);
            }

            this.RobotTradingItemList.Add(Consts.RobotTradingGroupHeaderVariance, sumItem);

            return this;
        }

        public BetTypeItem GenereateGroupRealTotal(IEnumerable<BetTypePerformanceInfo> betTypeInfos)
        {
            var sumItem = new RobotTradingItem
            {
                GroupHeaderName = Consts.RobotTradingGroupHeaderRealTotal,
                TypeSideId = 0,
                TypeSideDesc = string.Empty,
                Turnover = betTypeInfos.Sum(x => x.Stake_AR),
                WinLoss = betTypeInfos.Sum(x => x.Winloss_AR)               
            };
            sumItem.Margin = sumItem.Turnover == 0 ? 0 : sumItem.WinLoss / sumItem.Turnover;

            foreach (var info in betTypeInfos)
            {
                var robotTradingItem = new RobotTradingItem
                {
                    GroupHeaderName = Consts.RobotTradingGroupHeaderRealTotal,
                    TypeSideId = info.TypeSiteId,
                    TypeSideDesc = info.TypeSiteDesc,
                    Turnover = info.Stake_AR,
                    WinLoss = info.Winloss_AR,
                    Margin = info.Margin_AR
                };              

                this.RobotTradingItemList.Add(robotTradingItem.GroupHeaderName + robotTradingItem.TypeSideDesc, robotTradingItem);
            }

            this.RobotTradingItemList.Add(Consts.RobotTradingGroupHeaderRealTotal, sumItem);

            return this;
        }

        public BetTypeItem GenereateGroupTotal8RM(IEnumerable<BetTypePerformanceInfo> betTypeInfos)
        {
            var sumItem = new RobotTradingItem
            {
                GroupHeaderName = Consts.RobotTradingGroupHeaderTotal8RM,
                TypeSideId = 0,
                TypeSideDesc = string.Empty,
                Turnover = betTypeInfos.Sum(x => x.Stake_8RM),
                WinLoss = betTypeInfos.Sum(x => x.Winloss_8RM)
            };
            sumItem.Margin = sumItem.Turnover == 0 ? 0 : sumItem.WinLoss / sumItem.Turnover;

            foreach (var info in betTypeInfos)
            {
                var robotTradingItem = new RobotTradingItem
                {
                    GroupHeaderName = Consts.RobotTradingGroupHeaderTotal8RM,
                    TypeSideId = info.TypeSiteId,
                    TypeSideDesc = info.TypeSiteDesc,
                    Turnover = info.Stake_8RM,
                    WinLoss = info.Winloss_8RM,
                    Margin = info.Margin_8RM
                };                

                this.RobotTradingItemList.Add(robotTradingItem.GroupHeaderName + robotTradingItem.TypeSideDesc, robotTradingItem);
            }

            this.RobotTradingItemList.Add(Consts.RobotTradingGroupHeaderTotal8RM, sumItem);

            return this;
        }

        public BetTypeItem GenereateGroupRealTotal8RMWL(IEnumerable<BetTypePerformanceInfo> betTypeInfos)
        {
            var sumItem = new RobotTradingItem
            {
                GroupHeaderName = Consts.RobotTradingGroupHeaderRealTotal8RMWL,
                TypeSideId = 0,
                TypeSideDesc = string.Empty,
                Turnover = betTypeInfos.Sum(x => x.Stake_AR8RM),
                WinLoss = betTypeInfos.Sum(x => x.Winloss_AR8RM)
            };
            sumItem.Margin = sumItem.Turnover == 0 ? 0 : sumItem.WinLoss / sumItem.Turnover;

            foreach (var info in betTypeInfos)
            {
                var robotTradingItem = new RobotTradingItem
                {
                    GroupHeaderName = Consts.RobotTradingGroupHeaderRealTotal8RMWL,
                    TypeSideId = info.TypeSiteId,
                    TypeSideDesc = info.TypeSiteDesc,
                    Turnover = info.Stake_AR8RM,
                    WinLoss = info.Winloss_AR8RM,
                    Margin = info.Margin_AR8RM
                };

                this.RobotTradingItemList.Add(robotTradingItem.GroupHeaderName + robotTradingItem.TypeSideDesc, robotTradingItem);
            }

            this.RobotTradingItemList.Add(Consts.RobotTradingGroupHeaderRealTotal8RMWL, sumItem);

            return this;
        }     
    }
}