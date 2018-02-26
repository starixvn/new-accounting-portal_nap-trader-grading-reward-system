namespace Fanex.NAP.TGRS.Reports.Services.Interfaces
{
    using Fanex.NAP.TGRS.Reports.Criteria.TraderPerformanceMonthly;
    using Fanex.NAP.TGRS.Reports.Models.TraderPerformanceMonthly;
    using System.IO;

    public interface ITraderMonthlyReport
    {
        SummaryList GetReports(GetTraderPerformanceMonthlyCriteria filter);

        Stream ExportExcel(string template, GetTraderPerformanceMonthlyCriteria filter);
    }
}