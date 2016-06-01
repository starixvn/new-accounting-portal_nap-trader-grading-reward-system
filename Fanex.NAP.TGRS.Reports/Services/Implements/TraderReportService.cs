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

        public MatchPerformanceGroup GetMatchPerformanceOfLeague(GetTraderLeaguePerformanceDetailCriteria criteria)
        {
            IEnumerable<MatchPerformanceInfo> matchData = this.GetData<MatchPerformanceInfo>(criteria);
            MatchPerformanceGroup matchPerformance = new MatchPerformanceGroup();

            if (matchData != null && matchData.Any())
            {
                foreach (MatchPerformanceInfo match in matchData)
                {
                    matchPerformance.AddItem(new MatchPerformanceItem(match));
                }

                matchPerformance.Total.Margin = CalculateTotalMargin(matchPerformance.Total.WinLoss, matchPerformance.Total.Turnover);

                matchPerformance.Total.Margin = CalculateTotalMargin(matchPerformance.Total.WinLoss, matchPerformance.Total.Turnover);
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
