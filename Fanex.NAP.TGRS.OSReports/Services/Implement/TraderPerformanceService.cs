namespace Fanex.NAP.TGRS.OSReports.Services.Implement
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.TraderPerformance;
    using Fanex.NAP.TGRS.OSReports.Services.Interface;
    using System.Collections.Generic;

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
    }
}
