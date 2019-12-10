namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.Data.Repository;
    using Fanex.NAP.TGRS.Reports.Criteria.MultipleMatchesPerformance;
    using Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance;
    using System.Collections.Generic;

    public interface IMultipleMatchesReportService
    {
        IEnumerable<TeamItem> GetTeams();

        TraderPerformanceList GetTraderPerformance(ICriteria criteria);

        void ExportTraderPerformance(int userId, GetTraderPerformanceCriteria criteria, string templatePath);

        MatchPerformanceList GetMatchPerformanceOfTrader(ICriteria criteria);

        BetTypeList GetBettypeTrader(ICriteria criteria);
    }
}