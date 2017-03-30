namespace Fanex.NAP.TGRS.OSReports.Services.Interface
{
    using Fanex.NAP.TGRS.OSReports.Criteria.NewTraderPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.NewTraderPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.SportPerformance;
    using System.Collections.Generic;

    public interface INewTraderPerformanceService
    {
        IEnumerable<TraderPerformance> GetTraderPerformances(GetTraderPerformanceCriteria criteria);

        IEnumerable<SportPerformance> GetSportPerformances(GetSportByTraderCriteria criteria);

        IEnumerable<RegionPerformance> GetRegionPerformances(GetRegionByTraderCriteria criteria);

        List<Sport> GetAllSport();
    }
}
