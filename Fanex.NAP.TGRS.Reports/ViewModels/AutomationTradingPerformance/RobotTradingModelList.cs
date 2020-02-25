namespace Fanex.NAP.TGRS.Reports.ViewModels.AutomationTradingPerformance
{
    using Fanex.NAP.TGRS.Core.Consts;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Models.AutomationTradingPerformance;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    [Serializable]
    public class RobotTradingModelList
    {
        public RobotTradingModelList()
        {
            KeyList = new List<string>();
            GroupHeaderList = new List<GroupHeader>();
            MeasurementHiddenList = new List<MeasurementItem>();
        }

        protected List<string> KeyList { get; set; }

        protected IDictionary<string, string> SiteList
        {
            get
            {
                var sites = new Dictionary<string, string>();
                sites.Add("1", Consts.SiteCN88);
                sites.Add("2", Consts.SiteCash);
                sites.Add("3", Consts.SiteNova);

                return sites;
            }
        }

        public int LeagueCount { get; set; }

        public int MatchCount { get; set; }       

        public RobotTradingSummary Summary { get; set; }

        public IList<GroupHeader> GroupHeaderList { get; set; }

        public IList<MeasurementItem> MeasurementHiddenList { get; set; }

        public RobotTradingModelList GenerateLeagueMacthTotal(TotalLeagueMatchInfo totalInfo)
        {
            this.LeagueCount = totalInfo.LeagueCount;
            this.MatchCount = totalInfo.MatchCount;

            return this;
        }

        public RobotTradingModelList GenerateSummary(IEnumerable<TotalPerformanceInfo> infos)
        {
            if (infos.Any())
            {
                var totalInfo = infos.ToList()[0];

                this.Summary = new RobotTradingSummary
                {
                    VirtualTotalTurnover = totalInfo.Total_Stake_VR,
                    VirtualTotalWinLoss = totalInfo.Total_WinLoss_VR,
                    VirtualTotalMargin = totalInfo.Total_Margin_VR,
                    VarianceTurnover = totalInfo.Total_Stake_VAR,
                    VarianceWinLoss = totalInfo.Total_Winloss_VAR,
                    VarianceMargin = totalInfo.Total_Margin_VAR,
                    RealTotalTurnover = totalInfo.Total_Stake_AR,
                    RealTotalWinLoss = totalInfo.Total_Winloss_AR,
                    RealTotalMargin = totalInfo.Total_Margin_AR,
                    Total8RMTurnover = totalInfo.Total_Stake_8RM,
                    Total8RMWinLoss = totalInfo.Total_Winloss_8RM,
                    Total8RMMargin = totalInfo.Total_Margin_8RM,
                    Total8RMWLTurnover = totalInfo.Total_Stake_AR8RM,
                    Total8RMWLWinLoss = totalInfo.Total_Winloss_AR8RM,
                    Total8RMWLMargin = totalInfo.Total_Margin_AR8RM
                };
            }            

            return this;
        }

        public RobotTradingModelList GenerateGroupHeader(string measurements, string typeSiteIds)
        {
            if (!string.IsNullOrEmpty(measurements) && !string.IsNullOrEmpty(typeSiteIds))
            {
                var arrSite = typeSiteIds.Split(',');
                var firtSiteName = SiteList[arrSite.Max(x => x)];
                var arrMeasurement = measurements.Split(',');

                var listVirtualToal = arrMeasurement.Where(x => x.Contains(Consts.AutomationTradingGroupHeaderVirtualTotal + "-")).Select(x => x).ToList();
                var listVariance = arrMeasurement.Where(x => x.Contains(Consts.AutomationTradingGroupHeaderVariance + "-")).Select(x => x).ToList();
                var listRealTotal = arrMeasurement.Where(x => x.Contains(Consts.AutomationTradingGroupHeaderRealTotal + "-")).Select(x => x).ToList();
                var listTotal8RM = arrMeasurement.Where(x => x.Contains(Consts.AutomationTradingGroupHeaderTotal8RM + "-")).Select(x => x).ToList();
                var listRealTotal8RMWL = arrMeasurement.Where(x => x.Contains(Consts.AutomationTradingGroupHeaderRealTotal8RMWL + "-")).Select(x => x).ToList();

                GenerateGroupHeader(listVirtualToal, firtSiteName, arrSite.Length, ViewLang.VirtualTotal);
                GenerateGroupHeader(listVariance, firtSiteName, arrSite.Length, ViewLang.Variance);
                GenerateGroupHeader(listRealTotal, firtSiteName, arrSite.Length, ViewLang.RealTotal);
                GenerateGroupHeader(listTotal8RM, firtSiteName, arrSite.Length, ViewLang.Total8RM);
                GenerateGroupHeader(listRealTotal8RMWL, firtSiteName, arrSite.Length, ViewLang.RealTotal8RMWL);
            }

            return this;
        }

        private void GenerateGroupHeader(List<string> listColumn, string firtSiteName, int siteLength, string headerText)
        {
            if (listColumn.Any())
            {
                var mergeCol = listColumn.Count * 4 - listColumn.Count * (3 - siteLength);
                var groupVirtualToal = listColumn[0].Split('-');

                this.GroupHeaderList.Add(new GroupHeader
                {
                    HeaderText = headerText.ToUpper(),
                    ColumnName = "Col" + groupVirtualToal[0] + firtSiteName + groupVirtualToal[1],
                    MergeColumnNumber = mergeCol
                });
            }
        }

        public RobotTradingModelList GenerateMeasurementHidden(string measurementHides)
        {
            if (!string.IsNullOrEmpty(measurementHides))
            {
                var arrMeasurement = measurementHides.Split(',');

                foreach (var measurement in arrMeasurement)
                {
                    var arr = measurement.Split('-');
                    if (arr.Length == 2)
                    {
                        this.MeasurementHiddenList.Add(new MeasurementItem
                        {
                            GroupHeaderName = arr[0],
                            Measurement = arr[1]
                        });
                    }
                }
            }            

            return this;
        }
    }
}