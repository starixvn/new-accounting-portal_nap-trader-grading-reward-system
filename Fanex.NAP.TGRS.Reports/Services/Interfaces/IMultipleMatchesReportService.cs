namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.Data.Repository;
    using Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance;

    public interface IMultipleMatchesReportService
    {
        TraderPerformanceList GetTraderPerformance(ICriteria criteria);

        MatchPerformanceList GetMatchPerformanceOfTrader(ICriteria criteria);
    }
}