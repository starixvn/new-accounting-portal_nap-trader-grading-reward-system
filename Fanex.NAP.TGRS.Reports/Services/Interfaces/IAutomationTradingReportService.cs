namespace Fanex.NAP.TGRS.Reports.Services
{    
    using Fanex.NAP.TGRS.Reports.Criteria.AutomationTradingPerformance;
    using Fanex.NAP.TGRS.Reports.ViewModels.AutomationTradingPerformance;
    using System.Collections.Generic;

    public interface IAutomationTradingReportService
    {
        Dictionary<int, LeagueGroup> GetLeagueGroups();

        AutoTradingList GetAutoTradingBetTypePerformance(GetBetTypePerformanceCriteria criteria);
       
        void ExportAutoTradingBetTypePerformance(int userId, GetBetTypePerformanceCriteria criteria, string templatePath);

        AutoTradingList GetAutoTradingWeekPerformance(GetWeekPerformanceCriteria criteria);

        AutoTradingList GetAutoTradingMonthPerformance(GetMonthPerformanceCriteria criteria);

        void ExportAutoTradingPeriodPerformance(int userId, GetMonthPerformanceCriteria criteria, string templatePath);

        ModelPerformanceList GetAutoTradingModelPerformance(GetModelPerformanceCriteria criteria);

        void ExportAutoTradingModelPerformance(int userId, GetModelPerformanceCriteria criteria, string templatePath);

        AutoTradingList GetAutoTradingEventPerformance(GetEventPerformanceCriteria criteria);        

        void ExportAutoTradingEventPerformance(int userId, GetEventPerformanceCriteria criteria, string templatePath);

        AutoTradingList GetAutoTradingLeaguePerformanceOfEvent(GetLeaguePerformanceOfEventCriteria criteria);

        string GetLeagueIdListFromEventListCache(string cacheKey);

        void ExportAutoTradingLeaguePerformanceOfEvent(int userId, GetLeaguePerformanceOfEventCriteria criteria, string templatePath);

        AutoTradingList GetAutoTradingEventLeaguePerformance(GetLeaguePerformanceOfEventCriteria criteria);

        void ExportAutoTradingEventLeaguePerformance(AutoTradingList eventLeagueList, int userId, GetLeaguePerformanceOfEventCriteria criteria, string templatePath);

        AutoTradingList GetAutoTradingMatchPerformanceOfEventLeague(GetMatchPerformanceOfEventLeagueCriteria criteria);

        string GetMatchIdListFromMatchListCache(string cacheKey);

        void ExportAutoTradingMatchPerformanceOfEventLeague(int userId, GetMatchPerformanceOfEventLeagueCriteria criteria, string templatePath);

    }
}