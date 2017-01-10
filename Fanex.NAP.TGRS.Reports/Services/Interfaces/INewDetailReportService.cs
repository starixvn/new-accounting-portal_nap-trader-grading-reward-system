namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.NAP.Framework.Data;
    using Fanex.NAP.TGRS.Reports.Criteria.NewPerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.NewPerformanceDetail;
    using System.Collections.Generic;

    public interface INewDetailReportService
    {
        #region League

        IEnumerable<LeaguePerformanceInfo> GetLeaguePerformance(ICriteria criteria);

        IEnumerable<LeagueTraderPerformanceInfo> GetTraderPerformanceByLeague(ICriteria criteria);

        IEnumerable<LeagueTraderMatchPerformanceInfo> GetMatchPerformanceOfLeagueAndTrader(ICriteria criteria);

        IEnumerable<LeagueTraderMatchBettypePerformanceInfo> GetBettypePerformanceOfLeagueTraderAndMatch(ICriteria criteria);

        IEnumerable<LeagueMatchPerformanceInfo> GetMatchPerformanceOfLeague(ICriteria criteria);
        
        IEnumerable<LeagueMatchBettypePerformanceInfo> GetBettypePerformanceOfLeagueAndMatch(ICriteria criteria);

        void ExportLeaguePerformance(GetLeaguePerformanceCriteria criteria, string templatePath);
        
        #endregion League
        
        #region New Performance Detail - Trader
        IEnumerable<TraderPerformanceInfo> GetTraderPerformance(ICriteria criteria);

        IEnumerable<MatchPerformanceInfo> GetTraderMatchPerformance(ICriteria criteria);

        IEnumerable<BetTypePerformanceInfo> GetTraderMatchBettypePerformance(ICriteria criteria);
        #endregion

        #region Grade

        IEnumerable<GradePerformanceInfo> GetGradePerformance(ICriteria criteria);

        IEnumerable<GradeLeaguePerformanceInfo> GetGradeLeaguePerformance(ICriteria criteria);

        IEnumerable<GradeLeagueTraderPerformanceInfo> GetGradeLeagueTraderPerformance(ICriteria criteria);

        IEnumerable<GradeLeagueTraderMatchPerformanceInfo> GetGradeLeagueTraderMatchPerformance(ICriteria criteria);

        IEnumerable<GradeLeagueMatchBettypePerformanceInfo> GetGradeLeagueTraderMatchBettypePerformance(ICriteria criteria);

        IEnumerable<GradeTraderPerformanceInfo> GetGradeTraderPerformance(ICriteria criteria);

        Dictionary<string, IEnumerable<GradeTraderMatchPerformanceInfo>> GetGradeTraderMatchPerformance(ICriteria criteria);

        void ExportGradePerformance(GetGradePerformanceCriteria criteria, bool isViewScore, string templatePath);

        #endregion Grade
    }
}