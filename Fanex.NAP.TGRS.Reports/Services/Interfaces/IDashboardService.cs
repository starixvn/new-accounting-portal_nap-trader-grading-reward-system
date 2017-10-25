namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.ViewModels.Dashboard;
    using System.Collections.Generic;

    public interface IDashboardService
    {
        IEnumerable<GeneralInfo> GetGeneralInfo(int month, int permission);

        IEnumerable<League> GetTopWinLeague(int month, int permission);

        IEnumerable<TopTrader> GetTopTrader(int month, int permission);

        IEnumerable<BetTypePerformance> GetTopBettype(int month, int permission);

        IEnumerable<MonthAmountItem> GetSummaryData(int month, int permission);

        IEnumerable<TeamPerformance> GetTeamData(int month, int permission);
    }
}