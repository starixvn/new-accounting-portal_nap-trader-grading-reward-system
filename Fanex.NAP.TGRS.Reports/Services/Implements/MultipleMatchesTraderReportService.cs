namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.Data.Repository;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance;
    using Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance;
    using System.Collections.Generic;
    using System.Linq;
    
    public partial class MultipleMatchesTraderReportService : TGRSBaseService, IMultipleMatchesReportService
    {
        private const string MultipleMatchesTraderPerformanceSessionKey = "Fanex.NAP.TGRS.Reports.TraderPerformance";

        /// <summary>
        /// Gets the trader performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>TraderPerformanceList object.</returns>
        public TraderPerformanceList GetTraderPerformance(ICriteria criteria)
        {
            var traderPerformance = new TraderPerformanceList();
            //var rawData = this.GetData<TraderPerformanceInfo>(criteria);
            var rawData = GenerateSampleTraderPerformance();

            if (rawData != null && rawData.Any())
            {
                var traderData = SortTraderPerformanceInfo(rawData);
                traderPerformance.AddTraderList(traderData);

                SessionManager.Set<TraderPerformanceList>(MultipleMatchesTraderPerformanceSessionKey, traderPerformance);
            }

            return traderPerformance;
        }

        private IEnumerable<TraderPerformanceInfo> SortTraderPerformanceInfo(IEnumerable<TraderPerformanceInfo> traderData)
        {
            return traderData.AsEnumerable()
                            .OrderBy(c => c.CustId)
                            .Select(c => new TraderPerformanceInfo
                            {
                                CustId = c.CustId,
                                MatchCount = c.MatchCount,
                                MultipleTimes = c.MultipleTimes,
                                FrequencyCust = traderData.Count(b => b.CustId == c.CustId)
                            });
        }

        private IEnumerable<TraderPerformanceInfo> GenerateSampleTraderPerformance()
        {
            var traderPerformances = new List<TraderPerformanceInfo>();
            for (int i = 1; i < 10; i++)
            {
                traderPerformances.Add(new TraderPerformanceInfo()
                {
                    CustId = i,
                    MatchCount = 1,
                    MultipleTimes = 1,
                    FrequencyCust = 1
                });
            }

            return traderPerformances;
        }

        /// <summary>
        /// Gets the match performance of a trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceList object.</returns>
        public MatchPerformanceList GetMatchPerformanceOfTrader(ICriteria criteria)
        {
            //var matchData = this.GetData<MatchPerformanceInfo>(criteria);
            var matchData = GenerateSampleMatchPerformance();

            var matchPerformance = new MatchPerformanceList();
            var matchGroups = matchData.GroupBy(obj => obj.MatchGroup);
            MatchPerformanceGroup matchGroup = null;

            foreach (IGrouping<string, MatchPerformanceInfo> group in matchGroups)
            {
                if (!string.IsNullOrEmpty(group.Key))
                {
                    matchGroup = new MatchPerformanceGroup(group.Key);
                    matchGroup.AddMatchList(group);
                    matchPerformance.AddItem(matchGroup);
                }
            }
            matchPerformance.GroupList = matchPerformance.GroupList.ToList();
            matchPerformance.TotalItems = matchData.Count();

            return matchPerformance;
        }

        private IEnumerable<MatchPerformanceInfo> GenerateSampleMatchPerformance()
        {
            var matchData = new List<MatchPerformanceInfo>();
            for (int i = 1; i < 4; i++)
            {
                matchData.Add(new MatchPerformanceInfo
                {
                    MatchGroup = "1",
                    AwayId = 1,
                    HomeId = 1,
                    BetCount = 1,
                    EventDate = new System.DateTime(2019, 10, 20),
                    FromDate = new System.DateTime(2019, 10, 20),
                    ToDate = new System.DateTime(2019, 10, 20),
                    Margin = 1,
                    MatchId = i,
                    Turnover = 1,
                    WinLoss = 1
                });               
            }

            for (int i = 1; i < 5; i++)
            {
                matchData.Add(new MatchPerformanceInfo
                {
                    MatchGroup = "2",
                    AwayId = 1,
                    HomeId = 1,
                    BetCount = 1,
                    EventDate = new System.DateTime(2019, 11, 20),
                    FromDate = new System.DateTime(2019, 11, 20),
                    ToDate = new System.DateTime(2019, 11, 20),
                    Margin = 1,
                    MatchId = i,
                    Turnover = 1,
                    WinLoss = 1
                });
            }

            return matchData;
        }
    }
}