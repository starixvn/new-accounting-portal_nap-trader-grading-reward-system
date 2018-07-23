namespace Fanex.NAP.TGRS.OSReports.Services.Implement
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSReports.Criteria.SportPerformance;
    using Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.SportPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.TraderPerformance;
    using Fanex.NAP.TGRS.OSReports.Services.Interface;
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

        public IEnumerable<MatchPerformance> GetTraderMatchPerformance(GetTraderMatchPerformanceCriteria criteria)
        {
            return GetData<MatchPerformance>(criteria);
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