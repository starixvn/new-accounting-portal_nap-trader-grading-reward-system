using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformance;
using Fanex.NAP.TGRS.OSReports.Models;
using Fanex.NAP.TGRS.OSReports.Models.TraderPerformance;

namespace Fanex.NAP.TGRS.OSReports.Services.Interface
{
    public interface ITraderPerformanceService
    {
        IEnumerable<TraderPerformance> GetTraderPerformances(GetTraderPerformanceCriteria criteria);

        IEnumerable<Models.TraderPerformance.SportPerformance> GetSportPerformances(GetSportByTraderCriteria criteria);
    }
}
