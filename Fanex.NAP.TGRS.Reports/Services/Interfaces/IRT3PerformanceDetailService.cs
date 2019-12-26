namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.Data.Repository;
    using Fanex.NAP.TGRS.Reports.Criteria.RT3PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.ViewModels.RT3PerformanceDetail;

    public interface IRT3PerformanceDetailService
    {
        BetTypePerformanceList GetBetTypePerformance(ICriteria criteria);

        void ExportBetTypePerformance(int userId, GetBetTypePerformanceCriteria criteria, string templatePath);

        MonthPerformanceList GetMonthPerformance(ICriteria criteria);

        void ExportMonthPerformance(int userId, GetMonthPerformanceCriteria criteria, string templatePath);
    }
}