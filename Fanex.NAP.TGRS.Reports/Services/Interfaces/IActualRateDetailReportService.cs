namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.Data.Repository;
    using Fanex.NAP.TGRS.Reports.Criteria.ActualRatePerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.NewPerformanceDetail;
    using System.Collections.Generic;

    public interface IActualRateDetailReportService
    {
        #region Trader
        IEnumerable<TraderPerformanceInfo> GetTraderPerformance(ICriteria criteria);

        IEnumerable<MatchPerformanceInfo> GetTraderMatchPerformance(ICriteria criteria);

        IEnumerable<TraderMatchBetTypePerformanceInfo> GetTraderMatchBettypePerformance(ICriteria criteria);

        void ExportTraderPerformance(GetActualRateTraderPerformanceCriteria criteria, string templatePath, bool isViewScore = true);
        #endregion Trader

        #region League
        IEnumerable<LeaguePerformanceInfo> GetLeaguePerformance(ICriteria criteria);
                
        IEnumerable<LeagueTraderPerformanceInfo> GetTraderPerformanceByLeague(ICriteria criteria);

        IEnumerable<LeagueTraderMatchPerformanceInfo> GetMatchPerformanceOfLeagueAndTrader(ICriteria criteria);

        IEnumerable<LeagueTraderMatchBettypePerformanceInfo> GetBettypePerformanceOfLeagueTraderAndMatch(ICriteria criteria);

        IEnumerable<LeagueMatchPerformanceInfo> GetMatchPerformanceOfLeague(ICriteria criteria);

        IEnumerable<LeagueMatchBettypePerformanceInfo> GetBettypePerformanceOfLeagueAndMatch(ICriteria criteria);

        void ExportLeaguePerformance(GetActualRateLeaguePerformanceCriteria criteria, string templatePath);
        #endregion League

    }
}
