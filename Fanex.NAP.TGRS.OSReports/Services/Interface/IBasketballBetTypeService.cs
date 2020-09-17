namespace Fanex.NAP.TGRS.OSReports.Services.Interface
{
    using Fanex.NAP.TGRS.OSReports.Criteria.BasketballPerformance;
    using Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance;
    using System.Collections.Generic;

    public interface IBasketballBetTypeService
    {
        IEnumerable<LeagueGroup> GetLeagueGroups();

        IEnumerable<GroupBetTypes> GetGroupBetTypes();

        IEnumerable<BettypePerformance> GetBettypePerformance(GetBettypePerformanceCriteria criteria);

    }
}
