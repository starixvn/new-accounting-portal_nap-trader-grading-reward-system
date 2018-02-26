namespace Fanex.NAP.TGRS.Reports.Services.Interfaces
{
    using Fanex.NAP.TGRS.Reports.Criteria.TraderPerformanceMonthly;
    using Fanex.NAP.TGRS.Reports.Models.TraderPerformanceMonthly;
    using System.IO;

    public interface ITraderMonthlyReport
    {
        SummaryList GetReports(MonthlyFilter filter);

        Stream ExportExcel(string template, MonthlyFilter filter);
    }
}