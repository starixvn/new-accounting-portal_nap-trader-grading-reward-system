namespace Fanex.NAP.TGRS.OSReports.Services.Interface
{
    using Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformanceByCC;
    using Fanex.NAP.TGRS.OSReports.Models.TraderPerformanceByCC;
    using System.Collections.Generic;

    public interface ITraderPerformanceByCCService
    {
        IEnumerable<SportModel> GetSportFilter();

        CustomerClassGroupViewModel GetCTSCustomerClassFilter();

        IEnumerable<TraderPerformanceByCCModel> GetTraderPerformancesByCC(GetTraderPerformanceByCCCriteria criteria);

        void ExportTradePerformanceCC(ExportExcelTradePerfCCViewModel exportModel, string templatePath);
    }
}
