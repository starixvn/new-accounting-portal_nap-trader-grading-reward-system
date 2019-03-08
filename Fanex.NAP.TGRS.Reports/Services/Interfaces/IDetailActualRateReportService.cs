using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.Data.Repository;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetailActualRate;
    using Fanex.NAP.TGRS.Reports.Models.NewPerformanceDetail;
    using System.Collections.Generic;

    public interface IDetailActualRateReportService
    {
        #region New Performance Detail - Trader
        IEnumerable<TraderPerformanceInfo> GetTraderPerformance(ICriteria criteria);

        IEnumerable<MatchPerformanceInfo> GetTraderMatchPerformance(ICriteria criteria);

        IEnumerable<TraderMatchBetTypePerformanceInfo> GetTraderMatchBettypePerformance(ICriteria criteria);

        void ExportTraderPerformance(GetTraderPerformanceActualRateCriteria criteria, string templatePath, bool isViewScore = true);        
        #endregion
    }
}
