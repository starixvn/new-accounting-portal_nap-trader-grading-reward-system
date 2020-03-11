namespace Fanex.NAP.TGRS.Reports.Services
{    
    using Fanex.NAP.TGRS.Reports.Criteria.AutomationTradingPerformance;
    using Fanex.NAP.TGRS.Reports.ViewModels.AutomationTradingPerformance;
    using System.Collections.Generic;

    public interface IAutomationTradingPerformanceService
    {
        Dictionary<int, string> GetLeagueGroups();

        BetTypeList GetAutoTradingBetTypePerformance(GetBetTypePerformanceCriteria criteria);
       
        void ExportAutoTradingBetTypePerformance(int userId, GetBetTypePerformanceCriteria criteria, string templatePath);

        PeriodList GetAutoTradingWeekPerformance(GetWeekPerformanceCriteria criteria);

        PeriodList GetAutoTradingMonthPerformance(GetMonthPerformanceCriteria criteria);

        void ExportAutoTradingPeriodPerformance(int userId, GetMonthPerformanceCriteria criteria, string templatePath);

        ModelPerformanceList GetAutoTradingModelPerformance(GetModelPerformanceCriteria criteria);

        void ExportAutoTradingModelPerformance(int userId, GetModelPerformanceCriteria criteria, string templatePath);

    }
}