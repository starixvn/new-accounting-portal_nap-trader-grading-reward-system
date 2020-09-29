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

        BetChoiceOfBettypeList GetBetChoiceOfBettype(GetBetChoiceOfBettypeCriteria criteria);

        TraderOfBettypeList GetTraderOfBettype(GetTraderOfBettypeCriteria criteria);

        MatchOfBettypeTraderList GetMatchOfBettypeTrader(GetMatchOfBettypeTraderCriteria criteria);

        LeagueOfBettypeList GetLeagueOfBettype(GetLeagueOfBettypeCriteria criteria);

        TraderOfBettypeLeagueList GetTraderOfBettypeLeague(GetTraderOfBettypeLeagueCriteria criteria);

        MatchOfBettypeLeagueTraderList GetMatchOfBettypeLeagueTrader(GetMatchOfBettypeLeagueTraderCriteria criteria);

    }
}