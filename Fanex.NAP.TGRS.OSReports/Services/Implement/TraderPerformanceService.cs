namespace Fanex.NAP.TGRS.OSReports.Services.Implement
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSReports.Criteria.SportPerformance;
    using Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.SportPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.TraderPerformance;
    using Fanex.NAP.TGRS.OSReports.Services.Interface;
    using Fanex.NAP.TGRS.OSReports.ViewModel.TraderPerformance;
    using System.Collections.Generic;
    using System.Linq;

    public class TraderPerformanceService : TGRSBaseService, ITraderPerformanceService
    {
        public IEnumerable<TraderPerformance> GetTraderPerformances(GetTraderPerformanceCriteria criteria)
        {
            return GetData<TraderPerformance>(criteria);
        }

        public IEnumerable<Models.TraderPerformance.SportPerformance> GetSportPerformances(GetSportByTraderCriteria criteria)
        {
            return GetData<Models.TraderPerformance.SportPerformance>(criteria);
        }

        public List<Sport> GetAllSport()
        {
            var result = this.GetData<Sport>(new GetAllSportsCriteria());

            return result != null ? result.ToList() : new List<Sport>();
        }

        public IEnumerable<RegionPerformance> GetRegionPerformances(GetRegionByTraderCriteria criteria)
        {
            return GetData<RegionPerformance>(criteria);
        }

        public List<LeaguePerformance> GetTraderSportLeaguePerformance(GetTraderSportLeaguePerformanceCriteria criteria)
        {
            var result = this.GetData<LeaguePerformance>(criteria);

            return result != null ? result.ToList() : new List<LeaguePerformance>();
        }

        public List<BettypePerformance> GetTraderSportLeagueBettypePerformance(GetTraderSportLeagueBettypePerformanceCriteria criteria)
        {
            var result = this.GetData<BettypePerformance>(criteria);

            return result != null ? result.ToList() : new List<BettypePerformance>();
        }

        public IEnumerable<MatchPerformanceInfo> GetTraderMatchPerformance(GetTraderMatchPerformanceCriteria criteria)
        {
            var matchList = new List<MatchPerformanceInfo>();
            var data = GetData<MatchPerformance>(criteria);            

            if (data != null && data.Any())
            {
                // Sport is Cricket
                if (criteria.SportId == 50)
                {
                    var singularMatches = data.Where(x => x.ChildMatchType != 200);

                    foreach (var singularMatchItem in singularMatches)
                    {
                        var parentMatchInfo = new MatchPerformanceInfo(singularMatchItem);

                        var childMatches = data.Where(x => x.ChildMatchType == 200 && x.ParentID == singularMatchItem.MatchId)
                                               .Select(x => new MatchPerformanceInfo(x));

                        if (childMatches.Any())
                        {
                            var treeMatches = childMatches.ToList();

                            treeMatches.Add(parentMatchInfo);

                            var sumMatchInfo = treeMatches.Aggregate<MatchPerformanceInfo, MatchPerformanceInfo>(null, (acc, s) => acc + s);

                            matchList.Add(sumMatchInfo);
                        }
                        else
                        {
                            matchList.Add(parentMatchInfo);
                        }
                    }
                }
                else
                {
                    var matchInfos = data.Select(x => new MatchPerformanceInfo(x));

                    matchList.AddRange(matchInfos);
                }
            }

            return matchList;
        }

        public IEnumerable<MatchBettype> GetMatchBettypes(GetMatchBettypeCriteria criteria)
        {
            return GetData<MatchBettype>(criteria)
                .OrderByDescending(bt => bt.Margin)
                .ThenByDescending(bt => bt.Turnover)
                .ThenByDescending(bt => bt.VWinloss);
        }
    }
}