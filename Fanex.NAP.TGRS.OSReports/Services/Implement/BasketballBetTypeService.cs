namespace Fanex.NAP.TGRS.OSReports.Services.Implement
{
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.OSReports.Criteria.BasketballPerformance;
    using Fanex.NAP.TGRS.OSReports.Services.Interface;
    using Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance;
    using System.Collections.Generic;
    
    public class BasketballBetTypeService : IBasketballBetTypeService
    {
        private const string LeagueGroupsSessionKey = "Fanex.NAP.TGRS.OSReports.Basketball.LeagueGroups";

        public IEnumerable<LeagueGroup> GetLeagueGroups()
        {
            var leagueGroupList = new List<LeagueGroup> {
                new LeagueGroup { LeagueGroupId = 1, LeagueGroupName = "Major" },
                new LeagueGroup { LeagueGroupId = 2, LeagueGroupName = "Minor 1" },
                new LeagueGroup { LeagueGroupId = 3, LeagueGroupName = "Minor 2" },
                new LeagueGroup { LeagueGroupId = 4, LeagueGroupName = "Minor 3" },
                new LeagueGroup { LeagueGroupId = 5, LeagueGroupName = "Minor 4" },
                new LeagueGroup { LeagueGroupId = 6, LeagueGroupName = "Others" },
                new LeagueGroup { LeagueGroupId = 7, LeagueGroupName = "Others 1" },
                new LeagueGroup { LeagueGroupId = 8, LeagueGroupName = "Others 2" },
                new LeagueGroup { LeagueGroupId = 9, LeagueGroupName = "Others 3" },
                new LeagueGroup { LeagueGroupId = 10, LeagueGroupName = "Others 4" },
                new LeagueGroup { LeagueGroupId = 11, LeagueGroupName = "Others 5" },
                new LeagueGroup { LeagueGroupId = 12, LeagueGroupName = "Other Groups" }
            };

            SessionManager.Set<List<LeagueGroup>>(LeagueGroupsSessionKey, leagueGroupList);

            return leagueGroupList;
        }

        public IEnumerable<GroupBetTypes> GetGroupBetTypes()
        {
            return new List<GroupBetTypes>();
        }

        public IEnumerable<BettypePerformance> GetBettypePerformance(GetBettypePerformanceCriteria criteria)
        {
            return new List<BettypePerformance>();
        }
    }
}
