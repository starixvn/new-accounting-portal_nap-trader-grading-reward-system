namespace Fanex.NAP.TGRS.Reports.Services
{    
    using Fanex.NAP.TGRS.Reports.Criteria.AutomationTradingPerformance;
    using Fanex.NAP.TGRS.Reports.ViewModels.AutomationTradingPerformance;
    using System.Collections.Generic;

    public interface IAutomationTradingPerformanceService
    {
        Dictionary<int, string> GetLeagueGroups();

        AutoTradingList GetAutoTradingBetTypePerformance(GetBetTypePerformanceCriteria criteria);
       
        void ExportAutoTradingBetTypePerformance(int userId, GetBetTypePerformanceCriteria criteria, string templatePath);

        AutoTradingList GetAutoTradingWeekPerformance(GetWeekPerformanceCriteria criteria);

        AutoTradingList GetAutoTradingMonthPerformance(GetMonthPerformanceCriteria criteria);

        void ExportAutoTradingPeriodPerformance(int userId, GetMonthPerformanceCriteria criteria, string templatePath);

        ModelPerformanceList GetAutoTradingModelPerformance(GetModelPerformanceCriteria criteria);

        void ExportAutoTradingModelPerformance(int userId, GetModelPerformanceCriteria criteria, string templatePath);

        AutoTradingList GetAutoTradingEventPerformance(GetEventPerformanceCriteria criteria);        

        void ExportAutoTradingEventLeagueGroupPerformance(int userId, GetEventPerformanceCriteria criteria, string templatePath);
    }
}