namespace Fanex.NAP.TGRS.Reports.Services.Interfaces
{
    using Criteria.TraderPerformanceMonthly;
    using Models.TraderPerformanceMonthly;
    using System.Collections.Generic;
    using System.IO;

    public interface ITraderMonthlyReport
    {
        SummaryList GetReports(GetTraderPerformanceMonthlyCriteria filter);

        Stream ExportExcel(string template, GetTraderPerformanceMonthlyCriteria filter);

        IEnumerable<Shift> GetShifts();
    }
}