namespace Fanex.NAP.TGRS.Reports.Services.Implements
{
    using Criteria.Trader;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Services.Interfaces;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;
    using Models.PerformanceSummary;
    using Models.Trader;
    using System.Collections.Generic;
    using System.Linq;
    using ViewModels.Trader;
    using BetTypePerformance = Models.Trader.BetTypePerformance;

    public class TraderReportService : TGRSBaseService, ITraderReportService
    {
        public IEnumerable<GeneralInfo> GetGeneralInfo(GetGeneralInfoCriteria criteria)
        {
            return GetData<GeneralInfo>(criteria);
        }

        public IEnumerable<TraderWinlossTurnover> GetTraderWinlossTurnover(GetTraderWinLossTurnoverCriteria criteria)
        {
            return GetData<TraderWinlossTurnover>(criteria).OrderBy(x=>x.WLDate);
        }

        public IEnumerable<BetTypePerformance> GetTraderBettypePerformance(GetTraderBetTypePerformanceCriteria criteria)
        {
            return GetData<BetTypePerformance>(criteria);
        }

        public LeaguePerformanceList GetTraderLeaguePerformance(GetTraderLeaguePerformanceCriteria criteria)
        {
            var leagueData = this.GetData<LeaguePerformanceInfo>(criteria);
            var leaguePerformance = new LeaguePerformanceList();

            if (leagueData != null && leagueData.Any())
            {
                leaguePerformance.AddLeagueList(leagueData, true);
                leaguePerformance.Total.Margin = CalculateTotalMargin(leaguePerformance.Total.WinLoss, leaguePerformance.Total.Turnover);
                leaguePerformance.Total.MarginReal = CalculateTotalMargin(leaguePerformance.Total.WinLossReal, leaguePerformance.Total.TurnoverReal);
            }

            return leaguePerformance;
        }

        public MatchPerformanceGroup GetMatchPerformanceOfLeague(GetTraderLeaguePerformanceDetailCriteria criteria)
        {
            var matchData = this.GetData<MatchPerformanceInfo>(criteria);
            var matchPerformance = new MatchPerformanceGroup();

            if (matchData != null && matchData.Any())
            {
                matchPerformance.AddMatchList(matchData, true);

                matchPerformance.Total.Margin = CalculateTotalMargin(matchPerformance.Total.WinLoss, matchPerformance.Total.Turnover);
                matchPerformance.Total.MarginReal = CalculateTotalMargin(matchPerformance.Total.WinLossReal, matchPerformance.Total.TurnoverReal);
            }

            return matchPerformance;
        }

        public IEnumerable<BettypeOfMatch> GetBetTypeOfMatch(GetTraderLeaguePerformanceMatchDetailCriteria criteria)
        {
            return GetData<BettypeOfMatch>(criteria);
        }

        private decimal? CalculateTotalMargin(decimal winLoss, decimal turnover)
        {
            decimal? margin = null;

            if (turnover != 0)
            {
                margin = winLoss / turnover * 100;
            }

            return margin;
        }
    }
}
