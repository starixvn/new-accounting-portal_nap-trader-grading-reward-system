namespace Fanex.NAP.TGRS.Reports.Services
{    
    using Fanex.NAP.TGRS.Reports.Criteria.AutomationTradingPerformance;
    using Fanex.NAP.TGRS.Reports.ViewModels.AutomationTradingPerformance;
    using System.Collections.Generic;

    public interface IAutomationTradingPerformanceService
    {
        Dictionary<int, string> GetLeagueGroups();

        BetTypeList GetBetTypePerformance(GetBetTypePerformanceCriteria criteria);
       
        void ExportBetTypePerformance(int userId, GetBetTypePerformanceCriteria criteria, string templatePath);

        MonthlyList GetMonthPerformance(GetMonthPerformanceCriteria criteria);

        void ExportMonthPerformance(int userId, GetMonthPerformanceCriteria criteria, string templatePath);

        ModelPerformanceList GetModelPerformance(GetModelPerformanceCriteria criteria);

        void ExportModelPerformance(int userId, GetModelPerformanceCriteria criteria, string templatePath);

    }
}
