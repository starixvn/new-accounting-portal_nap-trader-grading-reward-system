namespace Fanex.NAP.TGRS.Reports.Services.Interfaces
{
    using Fanex.NAP.TGRS.Reports.Criteria.Trader;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Models.Trader;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.ViewModels.Trader;
    using System.Collections.Generic;

    public interface ITraderReportService
    {
        IEnumerable<GeneralInfo> GetGeneralInfo(GetGeneralInfoCriteria criteria);

        IEnumerable<TraderWinlossTurnover> GetTraderWinlossTurnover(GetTraderWinLossTurnoverCriteria criteria);

        IEnumerable<BetTypePerformance> GetTraderBettypePerformance(GetTraderBetTypePerformanceCriteria criteria);

        LeaguePerformanceList GetTraderLeaguePerformance(GetTraderLeaguePerformanceCriteria criteria);

        MatchPerformanceGroup GetMatchPerformanceOfLeague(GetTraderLeaguePerformanceDetailCriteria criteria);

        IEnumerable<BettypeOfMatch> GetBetTypeOfMatch(GetTraderLeaguePerformanceMatchDetailCriteria criteria);
    }
}
