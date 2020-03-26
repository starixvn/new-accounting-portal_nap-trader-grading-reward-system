namespace Fanex.NAP.TGRS.Reports.Services
{    
    using Fanex.NAP.TGRS.Reports.Criteria.AutomationTradingPerformance;
    using Fanex.NAP.TGRS.Reports.ViewModels.AutomationTradingPerformance;
    using System.Collections.Generic;

    public interface IAutomationTradingReportService
    {
        #region Bet Type
        Dictionary<int, LeagueGroup> GetLeagueGroups();

        AutoTradingList GetAutoTradingBetTypePerformance(GetBetTypePerformanceCriteria criteria);
       
        void ExportAutoTradingBetTypePerformance(int userId, GetBetTypePerformanceCriteria criteria, string templatePath);

        AutoTradingList GetAutoTradingLeaguePerformanceOfBetType(GetLeaguePerformanceOfBetTypeCriteria criteria);

        void ExportAutoTradingLeaguePerformanceOfBetType(int userId, GetLeaguePerformanceOfBetTypeCriteria criteria, string templatePath, string breadcrumb);

        AutoTradingList GetAutoTradingMatchPerformanceOfBetTypeLeague(GetMatchPerformanceOfBetTypeLeagueCriteria criteria);

        void ExportAutoTradingMatchPerformanceOfBetTypeLeague(int userId, GetMatchPerformanceOfBetTypeLeagueCriteria criteria, string templatePath, string breadcrumb);

        #endregion

        #region Period
        AutoTradingList GetAutoTradingWeekPerformance(GetWeekPerformanceCriteria criteria);

        AutoTradingList GetAutoTradingMonthPerformance(GetMonthPerformanceCriteria criteria);

        void ExportAutoTradingPeriodPerformance(int userId, GetMonthPerformanceCriteria criteria, string templatePath);

        AutoTradingList GetAutoTradingLeaguePerformanceOfPeriod(GetLeaguePerformanceOfPeriodCriteria criteria);

        void ExportAutoTradingLeaguePerformanceOfPeriod(int userId, GetLeaguePerformanceOfPeriodCriteria criteria, string templatePath, string breadcrumb);

        AutoTradingList GetAutoTradingMatchPerformanceOfPeriodLeague(GetMatchPerformanceOfPeriodLeagueCriteria criteria);

        void ExportAutoTradingMatchPerformanceOfPeriodLeague(int userId, GetMatchPerformanceOfPeriodLeagueCriteria criteria, string templatePath, string breadcrumb);
        #endregion

        #region Event
        AutoTradingList GetAutoTradingEventPerformance(GetEventPerformanceCriteria criteria);        

        void ExportAutoTradingEventPerformance(int userId, GetEventPerformanceCriteria criteria, string templatePath);

        AutoTradingList GetAutoTradingLeaguePerformanceOfEvent(GetLeaguePerformanceOfEventCriteria criteria);

        string GetLeagueIdListFromSession(string conditionKey, string sessionKey);

        void ExportAutoTradingLeaguePerformanceOfEvent(int userId, GetLeaguePerformanceOfEventCriteria criteria, string templatePath, string breadcrumb);

        AutoTradingList GetAutoTradingEventLeaguePerformance(GetLeaguePerformanceOfEventCriteria criteria);

        void ExportAutoTradingEventLeaguePerformance(AutoTradingList eventLeagueList, int userId, GetLeaguePerformanceOfEventCriteria criteria, string templatePath);

        AutoTradingList GetAutoTradingMatchPerformanceOfEventLeague(GetMatchPerformanceOfEventLeagueCriteria criteria);

        string GetMatchIdListFromMatchListCache(string cacheKey);

        string GetMatchIdListFromSession(string conditionKey, string sessionKey);

        void ExportAutoTradingMatchPerformanceOfEventLeague(int userId, GetMatchPerformanceOfEventLeagueCriteria criteria, string templatePath, string breadcrumb);

        #endregion

        #region Model
        ModelPerformanceList GetAutoTradingModelPerformance(GetModelPerformanceCriteria criteria);

        void ExportAutoTradingModelPerformance(int userId, GetModelPerformanceCriteria criteria, string templatePath);
        #endregion

    }
}