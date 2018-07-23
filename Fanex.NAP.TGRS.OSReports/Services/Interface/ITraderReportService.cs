namespace Fanex.NAP.TGRS.OSReports.Services.Interface
{
    using Fanex.NAP.TGRS.OSReports.Criteria.TraderReport;
    using Fanex.NAP.TGRS.OSReports.Models.TraderReport;
    using System;
    using System.Collections.Generic;

    public interface ITraderReportService
    {
        IEnumerable<Sport> GetSportPerformance(GetSportPerformanceCriteria criteria);

        Trader GetGeneralInfo(GetGeneralInfoCriteria criteria);

        IEnumerable<ChartData> GetChartData(GetChartDataCriteria criteria);
    }
}