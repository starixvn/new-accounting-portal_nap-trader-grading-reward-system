namespace Fanex.NAP.TGRS.Reports.Services.Implements
{
    using Criteria.Trader;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Reports.Services.Interfaces;
    using Models.PerformanceSummary;
    using Models.Trader;
    using System.Collections.Generic;

    public class TraderReportService : TGRSBaseService, ITraderReportService
    {
        public IEnumerable<GeneralInfo> GetGeneralInfo(GetGeneralInfoCriteria criteria)
        {
            return GetData<GeneralInfo>(criteria);
        }

        public IEnumerable<TraderWinlossTurnover> GetTraderWinlossTurnover(GetTraderWinLossTurnoverCriteria criteria)
        {
            return GetData<TraderWinlossTurnover>(criteria);
        }

        public IEnumerable<BetTypePerformance> GetTraderBettypePerformance(GetTraderBetTypePerformanceCriteria criteria)
        {
            return GetData<BetTypePerformance>(criteria);
        }

        public IEnumerable<LeaguePerformance> GetTraderLeaguePerformance(GetTraderLeaguePerformanceCriteria criteria)
        {
            return GetData<LeaguePerformance>(criteria);
        }
    }
}
