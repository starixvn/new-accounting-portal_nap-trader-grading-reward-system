namespace Fanex.NAP.TGRS.Reports.Services.Interfaces
{
    using Fanex.NAP.TGRS.Reports.Criteria.TraderPerformanceMonthly;
    using Fanex.NAP.TGRS.Reports.Models.TraderPerformanceMonthly;

    public interface ITraderMonthlyReport
    {
        SummaryList GetReports(MonthlyFilter filter);
    }
}