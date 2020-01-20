namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.Data.Repository;
    using Fanex.NAP.TGRS.Reports.Criteria.RT3PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.ViewModels.RT3PerformanceDetail;
    using System.Collections.Generic;

    public interface IRT3PerformanceDetailService
    {
        Dictionary<int, string> GetLeagueGroups();

        BetTypePerformanceList GetBetTypePerformance(ICriteria criteria);

        void ExportBetTypePerformance(int userId, GetBetTypePerformanceCriteria criteria, string templatePath);

        MonthPerformanceList GetMonthPerformance(ICriteria criteria);

        void ExportMonthPerformance(int userId, GetMonthPerformanceCriteria criteria, string templatePath);

        ModelPerformanceList GetModelPerformance(ICriteria criteria);

        void ExportModelPerformance(int userId, GetModelPerformanceCriteria criteria, string templatePath);
    }
}