namespace Fanex.NAP.TGRS.OSReports.Services.Interface
{
    using Fanex.NAP.TGRS.OSReports.Criteria.NewSportPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.NewSportPerformance;
    using System.Collections.Generic;

    public interface INewSportPerformanceService
    {
        List<Sport> GetAllSport();

        List<SportPerformanceItem> GetSportPerformance(GetSportPerformanceCriteria criteria);

        List<LeaguePerformanceItem> GetLeaguePerformance(GetLeaguePerformanceCriteria criteria);

        List<BettypePerformanceItem> GetBettypePerformance(GetBettypePerformanceCriteria criteria);

        List<RegionPerformanceItem> GetRegionPerformances(GetRegionBySportCriteria criteria);
    }
}
