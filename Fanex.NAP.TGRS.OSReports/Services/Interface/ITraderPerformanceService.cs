namespace Fanex.NAP.TGRS.OSReports.Services.Interface
{
    using Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.SportPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.TraderPerformance;
    using System.Collections.Generic;

    public interface ITraderPerformanceService
    {
        IEnumerable<TraderPerformance> GetTraderPerformances(GetTraderPerformanceCriteria criteria);

        IEnumerable<SportPerformance> GetSportPerformances(GetSportByTraderCriteria criteria);

        IEnumerable<RegionPerformance> GetRegionPerformances(GetRegionByTraderCriteria criteria);

        List<LeaguePerformance> GetTraderSportLeaguePerformance(GetTraderSportLeaguePerformanceCriteria criteria);

        List<BettypePerformance> GetTraderSportLeagueBettypePerformance(GetTraderSportLeagueBettypePerformanceCriteria criteria);

        List<Sport> GetAllSport();

        IEnumerable<MatchPerformance> GetTraderMatchPerformance(GetTraderMatchPerformanceCriteria criteria);

        IEnumerable<MatchBettype> GetMatchBettypes(GetMatchBettypeCriteria criteria);
    }
}
