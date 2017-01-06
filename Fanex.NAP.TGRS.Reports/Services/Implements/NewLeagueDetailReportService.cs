namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.NAP.Framework.Data;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.Models.NewPerformanceDetail;
    using System.Collections.Generic;

    public partial class NewDetailReportService : TGRSBaseService, INewDetailReportService
    {
        private const string LeaguePerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.Reports.NewLeaguePerformance";

        public IEnumerable<LeaguePerformanceInfo> GetLeaguePerformance(ICriteria criteria)
        {
            var result = this.GetData<LeaguePerformanceInfo>(criteria);

            result = result ?? new List<LeaguePerformanceInfo>();

            SessionManager.Set<IEnumerable<LeaguePerformanceInfo>>(LeaguePerformanceDetailReportSessionKey, result);

            return result;
        }

        public IEnumerable<LeagueTraderPerformanceInfo> GetTraderPerformanceByLeague(ICriteria criteria)
        {
            var result = this.GetData<LeagueTraderPerformanceInfo>(criteria);

            result = result ?? new List<LeagueTraderPerformanceInfo>();

            return result;
        }

        public IEnumerable<LeagueTraderMatchPerformanceInfo> GetMatchPerformanceOfLeagueAndTrader(ICriteria criteria)
        {
            var result = this.GetData<LeagueTraderMatchPerformanceInfo>(criteria);

            result = result ?? new List<LeagueTraderMatchPerformanceInfo>();

            return result;
        }

        public IEnumerable<LeagueTraderMatchBettypePerformanceInfo> GetBettypePerformanceOfLeagueTraderAndMatch(ICriteria criteria)
        {
            var result = this.GetData<LeagueTraderMatchBettypePerformanceInfo>(criteria);

            result = result ?? new List<LeagueTraderMatchBettypePerformanceInfo>();

            return result;
        }

        public IEnumerable<LeagueMatchPerformanceInfo> GetMatchPerformanceOfLeague(ICriteria criteria)
        {
            var result = this.GetData<LeagueMatchPerformanceInfo>(criteria);

            result = result ?? new List<LeagueMatchPerformanceInfo>();

            return result;
        }

        public IEnumerable<LeagueMatchBettypePerformanceInfo> GetBettypePerformanceOfLeagueAndMatch(ICriteria criteria)
        {
            var result = this.GetData<LeagueMatchBettypePerformanceInfo>(criteria);

            result = result ?? new List<LeagueMatchBettypePerformanceInfo>();

            return result;
        }
    }
}