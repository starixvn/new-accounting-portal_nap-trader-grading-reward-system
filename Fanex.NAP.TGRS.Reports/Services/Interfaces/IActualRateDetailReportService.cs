namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.Data.Repository;
    using Fanex.NAP.TGRS.Reports.Criteria.ActualRatePerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.NewPerformanceDetail;
    using System.Collections.Generic;

    public interface IActualRateDetailReportService
    {
        #region New Performance Detail - Trader
        IEnumerable<TraderPerformanceInfo> GetTraderPerformance(ICriteria criteria);

        IEnumerable<MatchPerformanceInfo> GetTraderMatchPerformance(ICriteria criteria);

        IEnumerable<TraderMatchBetTypePerformanceInfo> GetTraderMatchBettypePerformance(ICriteria criteria);

        void ExportTraderPerformance(GetTraderPerformanceActualRateCriteria criteria, string templatePath, bool isViewScore = true);        
        #endregion
    }
}
