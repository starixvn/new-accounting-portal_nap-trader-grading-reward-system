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

        #region Grade
        IEnumerable<GradePerformanceInfo> GetGradePerformance(ICriteria criteria);

        IEnumerable<GradeLeaguePerformanceInfo> GetGradeLeaguePerformance(ICriteria criteria);

        IEnumerable<GradeLeagueTraderPerformanceInfo> GetGradeLeagueTraderPerformance(ICriteria criteria);

        IEnumerable<GradeLeagueTraderMatchPerformanceInfo> GetGradeLeagueTraderMatchPerformance(ICriteria criteria);

        IEnumerable<GradeLeagueTraderMatchBettypePerformanceInfo> GetGradeLeagueTraderMatchBettypePerformance(ICriteria criteria);

        IEnumerable<GradeTraderMatchBettypePerformanceInfo> GetGradeTraderMatchBettypePerformance(ICriteria criteria);

        IEnumerable<GradeTraderPerformanceInfo> GetGradeTraderPerformance(ICriteria criteria);

        Dictionary<string, IEnumerable<GradeTraderMatchPerformanceInfo>> GetGradeTraderMatchPerformance(ICriteria criteria);

        void ExportGradePerformance(GetActualRateGradePerformanceCriteria criteria, bool isViewScore, string templatePath);
        #endregion Grade

        #region Team
        IEnumerable<TeamInfo> GetTeams();

        IEnumerable<TeamPerformanceInfo> GetTeamPerformance(ICriteria criteria);

        IEnumerable<TeamLeaguePerformanceInfo> GetTeamLeaguePerformance(ICriteria criteria);

        IEnumerable<TeamLeagueTraderPerformanceInfo> GetTeamLeagueTraderPerformance(ICriteria criteria);

        IEnumerable<TeamLeagueTraderMatchPerformanceInfo> GetTeamLeagueTraderMatchPerformance(ICriteria criteria);

        IEnumerable<TeamLeagueTraderMatchBettypePerformanceInfo> GetTeamLeagueTraderMatchBettypePerformance(ICriteria criteria);

        IEnumerable<TeamTraderMatchBettypePerformanceInfo> GetTeamTraderMatchBettypePerformance(ICriteria criteria);

        IEnumerable<TeamTraderPerformanceInfo> GetTeamTraderPerformance(ICriteria criteria);

        Dictionary<string, IEnumerable<TeamTraderMatchPerformanceInfo>> GetTeamTraderMatchPerformance(ICriteria criteria);

        void ExportTeamPerformance(GetActualRateTeamPerformanceCriteria criteria, bool isViewScore, string templatePath);
        #endregion Team

    }
}
