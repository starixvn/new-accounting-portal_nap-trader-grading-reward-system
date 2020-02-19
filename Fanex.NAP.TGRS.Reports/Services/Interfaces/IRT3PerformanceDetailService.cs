namespace Fanex.NAP.TGRS.Reports.Services
{    
    using Fanex.NAP.TGRS.Reports.Criteria.RT3PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.ViewModels.RT3PerformanceDetail;
    using System.Collections.Generic;

    public interface IRT3PerformanceDetailService
    {
        Dictionary<int, string> GetLeagueGroups();

        BetTypeList GetBetTypePerformance(GetBetTypePerformanceCriteria criteria);

        void ExportBetTypePerformance(int userId, GetBetTypePerformanceCriteria criteria, string templatePath);

        MonthPerformanceList GetMonthPerformance(GetMonthPerformanceCriteria criteria);

        void ExportMonthPerformance(int userId, GetMonthPerformanceCriteria criteria, string templatePath);

        ModelPerformanceList GetModelPerformance(GetModelPerformanceCriteria criteria);

        void ExportModelPerformance(int userId, GetModelPerformanceCriteria criteria, string templatePath);
    }
}