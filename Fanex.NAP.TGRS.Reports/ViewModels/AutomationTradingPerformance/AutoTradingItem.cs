namespace Fanex.NAP.TGRS.Reports.ViewModels.AutomationTradingPerformance
{
    using Fanex.NAP.TGRS.Core.Consts;
    using Fanex.NAP.TGRS.Reports.Models.AutomationTradingPerformance;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    [Serializable]
    public class AutoTradingItem : IAutoTradingItem
    {
        public AutoTradingItem()
        {
            this.RobotTradingItemList = new Dictionary<string, RobotTradingItem>();
        }

        public AutoTradingItem(string autoTradingName, IDictionary<string, string> siteList, IList<MeasurementItem> measurementHiddenList)
        {
            this.RobotTradingItemList = new Dictionary<string, RobotTradingItem>();
            this.AutoTradingName = autoTradingName;
            this.SiteList = siteList;
            this.MeasurementHiddenList = measurementHiddenList;
        }

        protected IDictionary<string, string> SiteList { get; set; }

        protected IList<MeasurementItem> MeasurementHiddenList { get; set; }

        public string AutoTradingName { get; set; }

        public int LeagueCount { get; set; }

        public int MatchCount { get; set; }

        public int BetCount { get; set; }

        public IDictionary<string, RobotTradingItem> RobotTradingItemList { get; set; }

        public AutoTradingItem GenerateLeagueMatchBetCount(LeagueMatchBetCountInfo matchInfo)
        {
            if (matchInfo != null)
            {
                this.LeagueCount = matchInfo.LeagueCount;
                this.MatchCount = matchInfo.MatchCount;
                this.BetCount = matchInfo.BetCount;
            }

            return this;
        }

        public AutoTradingItem GenereateGroupVirtualTotal(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            var mesurementHides = this.MeasurementHiddenList.Where(x => x.GroupHeaderName == Consts.AutomationTradingGroupHeaderVirtualTotal);

            foreach (var siteId in siteIdList)
            {
                var info = infos.Where(x => x.TypeSiteId == siteId).FirstOrDefault();

                if (info != null)
                {
                    var item = new RobotTradingItem(Consts.AutomationTradingGroupHeaderVirtualTotal,
                                                     info.TypeSiteId,
                                                     info.TypeSiteDesc,
                                                     mesurementHides);
                    item.Turnover = info.Stake_VR;
                    item.WinLoss = info.WinLoss_VR;
                    item.Margin = info.Margin_VR;

                    this.RobotTradingItemList.Add(Consts.AutomationTradingGroupHeaderVirtualTotal + info.TypeSiteDesc, item);
                }
                else
                {
                    this.RobotTradingItemList.Add(Consts.AutomationTradingGroupHeaderVirtualTotal + SiteList[siteId.ToString()],
                                        new RobotTradingItem(Consts.AutomationTradingGroupHeaderVirtualTotal,
                                                            siteId,
                                                            SiteList[siteId.ToString()],
                                                            mesurementHides));
                }
            }

            var sumItem = new RobotTradingItem(Consts.AutomationTradingGroupHeaderVirtualTotal, 0, string.Empty, mesurementHides);
            sumItem.Turnover = infos.Sum(x => x.Stake_VR);
            sumItem.WinLoss = infos.Sum(x => x.WinLoss_VR);
            sumItem.Margin = sumItem.Turnover == 0 ? 0 : (sumItem.WinLoss / sumItem.Turnover) * 100;

            this.RobotTradingItemList.Add(Consts.AutomationTradingGroupHeaderVirtualTotal, sumItem);

            return this;
        }

        public AutoTradingItem GenereateGroupVariance(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            var mesurementHides = this.MeasurementHiddenList.Where(x => x.GroupHeaderName == Consts.AutomationTradingGroupHeaderVariance);

            foreach (var siteId in siteIdList)
            {
                var info = infos.Where(x => x.TypeSiteId == siteId).FirstOrDefault();

                if (info != null)
                {
                    var item = new RobotTradingItem(Consts.AutomationTradingGroupHeaderVariance,
                                                       info.TypeSiteId,
                                                       info.TypeSiteDesc,
                                                       mesurementHides);
                    item.Turnover = info.Stake_VAR;
                    item.WinLoss = info.Winloss_VAR;
                    item.Margin = info.Margin_VAR;

                    this.RobotTradingItemList.Add(Consts.AutomationTradingGroupHeaderVariance + info.TypeSiteDesc, item);
                }
                else
                {
                    this.RobotTradingItemList.Add(Consts.AutomationTradingGroupHeaderVariance + SiteList[siteId.ToString()],
                                        new RobotTradingItem(Consts.AutomationTradingGroupHeaderVariance,
                                                            siteId,
                                                            SiteList[siteId.ToString()],
                                                            mesurementHides));
                }
            }

            var sumItem = new RobotTradingItem(Consts.AutomationTradingGroupHeaderVariance, 0, string.Empty, mesurementHides);
            sumItem.Turnover = infos.Sum(x => x.Stake_VAR);
            sumItem.WinLoss = infos.Sum(x => x.Winloss_VAR);
            sumItem.Margin = sumItem.Turnover == 0 ? 0 : (sumItem.WinLoss / sumItem.Turnover) * 100;

            this.RobotTradingItemList.Add(Consts.AutomationTradingGroupHeaderVariance, sumItem);

            return this;
        }

        public AutoTradingItem GenereateGroupRealTotal(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            var mesurementHides = this.MeasurementHiddenList.Where(x => x.GroupHeaderName == Consts.AutomationTradingGroupHeaderRealTotal);

            foreach (var siteId in siteIdList)
            {
                var info = infos.Where(x => x.TypeSiteId == siteId).FirstOrDefault();

                if (info != null)
                {
                    var item = new RobotTradingItem(Consts.AutomationTradingGroupHeaderRealTotal,
                                                       info.TypeSiteId,
                                                       info.TypeSiteDesc,
                                                       mesurementHides);
                    item.Turnover = info.Stake_AR;
                    item.WinLoss = info.Winloss_AR;
                    item.Margin = info.Margin_AR;

                    this.RobotTradingItemList.Add(Consts.AutomationTradingGroupHeaderRealTotal + info.TypeSiteDesc, item);
                }
                else
                {
                    this.RobotTradingItemList.Add(Consts.AutomationTradingGroupHeaderRealTotal + SiteList[siteId.ToString()],
                                        new RobotTradingItem(Consts.AutomationTradingGroupHeaderRealTotal,
                                                            siteId,
                                                            SiteList[siteId.ToString()],
                                                            mesurementHides));
                }
            }

            var sumItem = new RobotTradingItem(Consts.AutomationTradingGroupHeaderRealTotal, 0, string.Empty, mesurementHides);
            sumItem.Turnover = infos.Sum(x => x.Stake_AR);
            sumItem.WinLoss = infos.Sum(x => x.Winloss_AR);
            sumItem.Margin = sumItem.Turnover == 0 ? 0 : (sumItem.WinLoss / sumItem.Turnover) * 100;

            this.RobotTradingItemList.Add(Consts.AutomationTradingGroupHeaderRealTotal, sumItem);

            return this;
        }

        public AutoTradingItem GenereateGroupTotal8RM(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            var mesurementHides = this.MeasurementHiddenList.Where(x => x.GroupHeaderName == Consts.AutomationTradingGroupHeaderTotal8RM);

            foreach (var siteId in siteIdList)
            {
                var info = infos.Where(x => x.TypeSiteId == siteId).FirstOrDefault();

                if (info != null)
                {
                    var item = new RobotTradingItem(Consts.AutomationTradingGroupHeaderTotal8RM,
                                                          info.TypeSiteId,
                                                          info.TypeSiteDesc,
                                                          mesurementHides);
                    item.Turnover = info.Stake_8RM;
                    item.WinLoss = info.Winloss_8RM;
                    item.Margin = info.Margin_8RM;

                    this.RobotTradingItemList.Add(Consts.AutomationTradingGroupHeaderTotal8RM + info.TypeSiteDesc, item);
                }
                else
                {
                    this.RobotTradingItemList.Add(Consts.AutomationTradingGroupHeaderTotal8RM + SiteList[siteId.ToString()],
                                        new RobotTradingItem(Consts.AutomationTradingGroupHeaderTotal8RM,
                                                            siteId,
                                                            SiteList[siteId.ToString()],
                                                            mesurementHides));
                }
            }

            var sumItem = new RobotTradingItem(Consts.AutomationTradingGroupHeaderTotal8RM, 0, string.Empty, mesurementHides);
            sumItem.Turnover = infos.Sum(x => x.Stake_8RM);
            sumItem.WinLoss = infos.Sum(x => x.Winloss_8RM);
            sumItem.Margin = sumItem.Turnover == 0 ? 0 : (sumItem.WinLoss / sumItem.Turnover) * 100;

            this.RobotTradingItemList.Add(Consts.AutomationTradingGroupHeaderTotal8RM, sumItem);

            return this;
        }

        public AutoTradingItem GenereateGroupRealTotal8RMWL(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            var mesurementHides = this.MeasurementHiddenList.Where(x => x.GroupHeaderName == Consts.AutomationTradingGroupHeaderRealTotal8RMWL);

            foreach (var siteId in siteIdList)
            {
                var info = infos.Where(x => x.TypeSiteId == siteId).FirstOrDefault();

                if (info != null)
                {
                    var item = new RobotTradingItem(Consts.AutomationTradingGroupHeaderRealTotal8RMWL,
                                                         info.TypeSiteId,
                                                         info.TypeSiteDesc,
                                                         mesurementHides);
                    item.Turnover = info.Stake_AR8RM;
                    item.WinLoss = info.Winloss_AR8RM;
                    item.Margin = info.Margin_AR8RM;

                    this.RobotTradingItemList.Add(Consts.AutomationTradingGroupHeaderRealTotal8RMWL + info.TypeSiteDesc, item);
                }
                else
                {
                    this.RobotTradingItemList.Add(Consts.AutomationTradingGroupHeaderRealTotal8RMWL + SiteList[siteId.ToString()],
                                        new RobotTradingItem(Consts.AutomationTradingGroupHeaderRealTotal8RMWL,
                                                            siteId,
                                                            SiteList[siteId.ToString()],
                                                            mesurementHides));
                }
            }

            var sumItem = new RobotTradingItem(Consts.AutomationTradingGroupHeaderRealTotal8RMWL, 0, string.Empty, mesurementHides);
            sumItem.Turnover = infos.Sum(x => x.Stake_AR8RM);
            sumItem.WinLoss = infos.Sum(x => x.Winloss_AR8RM);
            sumItem.Margin = sumItem.Turnover == 0 ? 0 : (sumItem.WinLoss / sumItem.Turnover) * 100;

            this.RobotTradingItemList.Add(Consts.AutomationTradingGroupHeaderRealTotal8RMWL, sumItem);

            return this;
        }

    }
}