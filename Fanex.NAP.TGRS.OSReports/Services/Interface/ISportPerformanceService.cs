namespace Fanex.NAP.TGRS.OSReports.Services.Interface
{
    using Fanex.NAP.TGRS.OSReports.Criteria.SportPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.SportPerformance;
    using Fanex.NAP.TGRS.OSReports.ViewModel.SportPerformance;
    using System.Collections.Generic;

    public interface ISportPerformanceService
    {
        List<Sport> GetAllSport();

        List<SportPerformanceItem> GetSportPerformance(GetSportPerformanceCriteria criteria);

        List<LeaguePerformanceItem> GetLeaguePerformance(GetLeaguePerformanceCriteria criteria);

        IEnumerable<BettypePerformanceItem> GetBettypePerformance(GetBettypePerformanceCriteria criteria);

        List<RegionPerformanceItem> GetRegionPerformances(GetRegionBySportCriteria criteria);
    }
}
