namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.Data.Repository;
    using Fanex.NAP.TGRS.Reports.ViewModels.RT3PerformanceDetail;

    public interface IRT3PerformanceDetailService
    {
        BetTypePerformanceList GetBetTypePerformance(ICriteria criteria);       
    }
}