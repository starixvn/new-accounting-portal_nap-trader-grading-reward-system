namespace Fanex.NAP.TGRS.Reports.ViewModels.RTModelPerformanceDetail
{
    using Fanex.NAP.TGRS.Core.Consts;
    using Fanex.NAP.TGRS.Reports.Models.RTModelPerformanceDetail;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    [Serializable]
    public class RobotTradingModelItem
    {
        public RobotTradingModelItem()
        {
            RobotTradingItemList = new Dictionary<string, RobotTradingItem>();
        }

        protected IDictionary<string, string> SiteList { get; set; }

        protected IList<MeasurementItem> MeasurementHiddenList { get; set; }

        public int MatchCount { get; set; }

        public int BetCount { get; set; }

        public IDictionary<string, RobotTradingItem> RobotTradingItemList { get; set; }

        protected void GenerateMatchBetCount(MatchBetCountInfo matchInfo)
        {
            if (matchInfo != null)
            {
                this.MatchCount = matchInfo.MatchCount;
                this.BetCount = matchInfo.BetCount;
            }
        }

        protected void GenereateGroupVirtualTotal(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            var mesurementHides = this.MeasurementHiddenList.Where(x => x.GroupHeaderName == Consts.RobotTradingGroupHeaderVirtualTotal);

            foreach (var siteId in siteIdList)
            {
                var info = infos.Where(x => x.TypeSiteId == siteId).FirstOrDefault();

                if (info != null)
                {
                    var item = new RobotTradingItem(Consts.RobotTradingGroupHeaderVirtualTotal,
                                                     info.TypeSiteId,
                                                     info.TypeSiteDesc,
                                                     mesurementHides);
                    item.Turnover = info.Stake_VR;
                    item.WinLoss = info.WinLoss_VR;
                    item.Margin = info.Margin_VR;

                    this.RobotTradingItemList.Add(Consts.RobotTradingGroupHeaderVirtualTotal + info.TypeSiteDesc, item);
                }
                else
                {
                    this.RobotTradingItemList.Add(Consts.RobotTradingGroupHeaderVirtualTotal + SiteList[siteId.ToString()],
                                        new RobotTradingItem(Consts.RobotTradingGroupHeaderVirtualTotal,
                                                            siteId,
                                                            SiteList[siteId.ToString()],
                                                            mesurementHides));
                }
            }

            var sumItem = new RobotTradingItem(Consts.RobotTradingGroupHeaderVirtualTotal, 0, string.Empty, mesurementHides);
            sumItem.Turnover = infos.Sum(x => x.Stake_VR);
            sumItem.WinLoss = infos.Sum(x => x.WinLoss_VR);
            sumItem.Margin = sumItem.Turnover == 0 ? 0 : (sumItem.WinLoss / sumItem.Turnover) * 100;

            this.RobotTradingItemList.Add(Consts.RobotTradingGroupHeaderVirtualTotal, sumItem);           
        }

        protected void GenereateGroupVariance(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            var mesurementHides = this.MeasurementHiddenList.Where(x => x.GroupHeaderName == Consts.RobotTradingGroupHeaderVariance);

            foreach (var siteId in siteIdList)
            {
                var info = infos.Where(x => x.TypeSiteId == siteId).FirstOrDefault();

                if (info != null)
                {
                    var item = new RobotTradingItem(Consts.RobotTradingGroupHeaderVariance,
                                                       info.TypeSiteId,
                                                       info.TypeSiteDesc,
                                                       mesurementHides);
                    item.Turnover = info.Stake_VAR;
                    item.WinLoss = info.Winloss_VAR;
                    item.Margin = info.Margin_VAR;

                    this.RobotTradingItemList.Add(Consts.RobotTradingGroupHeaderVariance + info.TypeSiteDesc, item);
                }
                else
                {
                    this.RobotTradingItemList.Add(Consts.RobotTradingGroupHeaderVariance + SiteList[siteId.ToString()],
                                        new RobotTradingItem(Consts.RobotTradingGroupHeaderVariance,
                                                            siteId,
                                                            SiteList[siteId.ToString()],
                                                            mesurementHides));
                }
            }

            var sumItem = new RobotTradingItem(Consts.RobotTradingGroupHeaderVariance, 0, string.Empty, mesurementHides);
            sumItem.Turnover = infos.Sum(x => x.Stake_VAR);
            sumItem.WinLoss = infos.Sum(x => x.Winloss_VAR);
            sumItem.Margin = sumItem.Turnover == 0 ? 0 : (sumItem.WinLoss / sumItem.Turnover) * 100;

            this.RobotTradingItemList.Add(Consts.RobotTradingGroupHeaderVariance, sumItem);
        }

        protected void GenereateGroupRealTotal(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            var mesurementHides = this.MeasurementHiddenList.Where(x => x.GroupHeaderName == Consts.RobotTradingGroupHeaderRealTotal);

            foreach (var siteId in siteIdList)
            {
                var info = infos.Where(x => x.TypeSiteId == siteId).FirstOrDefault();

                if (info != null)
                {
                    var item = new RobotTradingItem(Consts.RobotTradingGroupHeaderRealTotal,
                                                       info.TypeSiteId,
                                                       info.TypeSiteDesc,
                                                       mesurementHides);
                    item.Turnover = info.Stake_AR;
                    item.WinLoss = info.Winloss_AR;
                    item.Margin = info.Margin_AR;

                    this.RobotTradingItemList.Add(Consts.RobotTradingGroupHeaderRealTotal + info.TypeSiteDesc, item);
                }
                else
                {
                    this.RobotTradingItemList.Add(Consts.RobotTradingGroupHeaderRealTotal + SiteList[siteId.ToString()],
                                        new RobotTradingItem(Consts.RobotTradingGroupHeaderRealTotal,
                                                            siteId,
                                                            SiteList[siteId.ToString()],
                                                            mesurementHides));
                }
            }

            var sumItem = new RobotTradingItem(Consts.RobotTradingGroupHeaderRealTotal, 0, string.Empty, mesurementHides);
            sumItem.Turnover = infos.Sum(x => x.Stake_AR);
            sumItem.WinLoss = infos.Sum(x => x.Winloss_AR);
            sumItem.Margin = sumItem.Turnover == 0 ? 0 : (sumItem.WinLoss / sumItem.Turnover) * 100;

            this.RobotTradingItemList.Add(Consts.RobotTradingGroupHeaderRealTotal, sumItem);
        }

        protected void GenereateGroupTotal8RM(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            var mesurementHides = this.MeasurementHiddenList.Where(x => x.GroupHeaderName == Consts.RobotTradingGroupHeaderTotal8RM);

            foreach (var siteId in siteIdList)
            {
                var info = infos.Where(x => x.TypeSiteId == siteId).FirstOrDefault();

                if (info != null)
                {
                    var item = new RobotTradingItem(Consts.RobotTradingGroupHeaderTotal8RM,
                                                          info.TypeSiteId,
                                                          info.TypeSiteDesc,
                                                          mesurementHides);
                    item.Turnover = info.Stake_8RM;
                    item.WinLoss = info.Winloss_8RM;
                    item.Margin = info.Margin_8RM;

                    this.RobotTradingItemList.Add(Consts.RobotTradingGroupHeaderTotal8RM + info.TypeSiteDesc, item);
                }
                else
                {
                    this.RobotTradingItemList.Add(Consts.RobotTradingGroupHeaderTotal8RM + SiteList[siteId.ToString()],
                                        new RobotTradingItem(Consts.RobotTradingGroupHeaderTotal8RM,
                                                            siteId,
                                                            SiteList[siteId.ToString()],
                                                            mesurementHides));
                }
            }

            var sumItem = new RobotTradingItem(Consts.RobotTradingGroupHeaderTotal8RM, 0, string.Empty, mesurementHides);
            sumItem.Turnover = infos.Sum(x => x.Stake_8RM);
            sumItem.WinLoss = infos.Sum(x => x.Winloss_8RM);
            sumItem.Margin = sumItem.Turnover == 0 ? 0 : (sumItem.WinLoss / sumItem.Turnover) * 100;

            this.RobotTradingItemList.Add(Consts.RobotTradingGroupHeaderTotal8RM, sumItem);
        }

        protected void GenereateGroupRealTotal8RMWL(List<int> siteIdList, IEnumerable<RTModelPerformanceInfo> infos)
        {
            var mesurementHides = this.MeasurementHiddenList.Where(x => x.GroupHeaderName == Consts.RobotTradingGroupHeaderRealTotal8RMWL);

            foreach (var siteId in siteIdList)
            {
                var info = infos.Where(x => x.TypeSiteId == siteId).FirstOrDefault();

                if (info != null)
                {
                    var item = new RobotTradingItem(Consts.RobotTradingGroupHeaderRealTotal8RMWL,
                                                         info.TypeSiteId,
                                                         info.TypeSiteDesc,
                                                         mesurementHides);
                    item.Turnover = info.Stake_AR8RM;
                    item.WinLoss = info.Winloss_AR8RM;
                    item.Margin = info.Margin_AR8RM;

                    this.RobotTradingItemList.Add(Consts.RobotTradingGroupHeaderRealTotal8RMWL + info.TypeSiteDesc, item);
                }
                else
                {
                    this.RobotTradingItemList.Add(Consts.RobotTradingGroupHeaderRealTotal8RMWL + SiteList[siteId.ToString()],
                                        new RobotTradingItem(Consts.RobotTradingGroupHeaderRealTotal8RMWL,
                                                            siteId,
                                                            SiteList[siteId.ToString()],
                                                            mesurementHides));
                }
            }

            var sumItem = new RobotTradingItem(Consts.RobotTradingGroupHeaderRealTotal8RMWL, 0, string.Empty, mesurementHides);
            sumItem.Turnover = infos.Sum(x => x.Stake_AR8RM);
            sumItem.WinLoss = infos.Sum(x => x.Winloss_AR8RM);
            sumItem.Margin = sumItem.Turnover == 0 ? 0 : (sumItem.WinLoss / sumItem.Turnover) * 100;

            this.RobotTradingItemList.Add(Consts.RobotTradingGroupHeaderRealTotal8RMWL, sumItem);
        }
    }
}