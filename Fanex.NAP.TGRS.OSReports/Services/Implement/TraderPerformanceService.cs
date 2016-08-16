using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fanex.NAP.TGRS.Core.BaseClasses;
using Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformance;
using Fanex.NAP.TGRS.OSReports.Models.TraderPerformance;
using Fanex.NAP.TGRS.OSReports.Services.Interface;

namespace Fanex.NAP.TGRS.OSReports.Services.Implement
{
    public class TraderPerformanceService : TGRSBaseService, ITraderPerformanceService
    {
        public IEnumerable<TraderPerformance> GetTraderPerformances(GetTraderPerformanceCriteria criteria)
        {
            return new[] { new TraderPerformance(), new TraderPerformance(), };
        }

        public IEnumerable<Models.TraderPerformance.SportPerformance> GetSportPerformances(GetSportByTraderCriteria criteria)
        {
            return new[]
            {new Models.TraderPerformance.SportPerformance(), new Models.TraderPerformance.SportPerformance(),};
        }
    }
}
