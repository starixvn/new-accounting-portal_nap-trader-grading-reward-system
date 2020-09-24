namespace Fanex.NAP.TGRS.OSReports.Services.Interface
{
    using Fanex.NAP.TGRS.OSReports.Criteria.BasketballPerformance;
    using Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance;
    using System.Collections.Generic;

    public interface IBasketballBetTypeService
    {
        IEnumerable<LeagueGroup> GetLeagueGroups();

        IEnumerable<GroupBettypes> GetGroupBetTypes();

        BettypePerformanceList GetBettypePerformance(GetBettypePerformanceCriteria criteria);

        LeagueOfBettypeList GetLeagueOfBettype(GetLeagueOfBettypeCriteria criteria);

        TraderOfBettypeLeagueList GetTraderOfBetTypeLeague(GetTraderOfBettypeLeagueCriteria criteria);

        MatchOfBettypeLeagueTraderList GetMatchOfBetTypeLeagueTrader(GetMatchOfBettypeLeagueTraderCriteria criteria);

    }
}