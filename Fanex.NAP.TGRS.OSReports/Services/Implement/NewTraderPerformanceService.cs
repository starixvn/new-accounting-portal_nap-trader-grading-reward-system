namespace Fanex.NAP.TGRS.OSReports.Services.Implement
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSReports.Criteria.NewTraderPerformance;
    using Fanex.NAP.TGRS.OSReports.Criteria.SportPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.NewTraderPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.SportPerformance;
    using Fanex.NAP.TGRS.OSReports.Services.Interface;
    using System.Collections.Generic;
    using System.Linq;

    public class NewTraderPerformanceService : TGRSBaseService, INewTraderPerformanceService
    {
        public IEnumerable<TraderPerformance> GetTraderPerformances(GetTraderPerformanceCriteria criteria)
        {
            return GetData<TraderPerformance>(criteria);
        }

        public IEnumerable<SportPerformance> GetSportPerformances(GetSportByTraderCriteria criteria)
        {
            return GetData<SportPerformance>(criteria);
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
    }
}
