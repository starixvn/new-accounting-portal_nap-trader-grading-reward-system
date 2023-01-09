namespace Fanex.NAP.TGRS.OSReports.Services.Interface
{
    using Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.SportPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.TraderPerformance;
    using Fanex.NAP.TGRS.OSReports.ViewModel.TraderPerformance;
    using System.Collections.Generic;

    public interface ITraderPerformanceService
    {
        IEnumerable<TraderPerformance> GetTraderPerformances(GetTraderPerformanceCriteria criteria);

        IEnumerable<SportPerformance> GetSportPerformances(GetSportByTraderCriteria criteria);

        IEnumerable<RegionPerformance> GetRegionPerformances(GetRegionByTraderCriteria criteria);

        List<LeaguePerformance> GetTraderSportLeaguePerformance(GetTraderSportLeaguePerformanceCriteria criteria);

        List<ViewModel.TraderPerformance.BettypePerformanceItem> GetTraderSportLeagueBettypePerformance(GetTraderSportLeagueBettypePerformanceCriteria criteria);

        List<Sport> GetAllSport();

        IEnumerable<MatchPerformanceInfo> GetTraderMatchPerformance(GetTraderMatchPerformanceCriteria criteria);

        IEnumerable<MatchBettypeItem> GetMatchBettypes(GetMatchBettypeCriteria criteria);
    }
}
