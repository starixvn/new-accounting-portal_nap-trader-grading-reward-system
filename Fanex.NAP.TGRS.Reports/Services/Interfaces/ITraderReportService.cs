namespace Fanex.NAP.TGRS.Reports.Services.Interfaces
{
    using Fanex.NAP.TGRS.Reports.Criteria.Trader;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Models.Trader;
    using System.Collections.Generic;

    public interface ITraderReportService
    {
        IEnumerable<GeneralInfo> GetGeneralInfo(GetGeneralInfoCriteria criteria);

        IEnumerable<TraderWinlossTurnover> GetTraderWinlossTurnover(GetTraderWinLossTurnoverCriteria criteria);

        IEnumerable<BetTypePerformance> GetTraderBettypePerformance(GetTraderBetTypePerformanceCriteria criteria);

        IEnumerable<LeaguePerformance> GetTraderLeaguePerformance(GetTraderLeaguePerformanceCriteria criteria);
    }
}
