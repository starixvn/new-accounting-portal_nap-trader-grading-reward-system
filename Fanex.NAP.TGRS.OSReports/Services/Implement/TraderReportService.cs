namespace Fanex.NAP.TGRS.OSReports.Services.Implement
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSReports.Criteria.TraderReport;
    using Fanex.NAP.TGRS.OSReports.Models.TraderReport;
    using Fanex.NAP.TGRS.OSReports.Services.Interface;
    using System.Collections.Generic;
    using System.Linq;

    public class TraderReportService : TGRSBaseService, ITraderReportService
    {
        public IEnumerable<Sport> GetSportPerformance(GetSportPerformanceCriteria criteria) => GetData<Sport>(criteria);

        public Trader GetGeneralInfo(GetGeneralInfoCriteria criteria) => GetData<Trader>(criteria).First();

        public IEnumerable<ChartData> GetChartData(GetChartDataCriteria criteria) => GetData<ChartData>(criteria);
    }
}