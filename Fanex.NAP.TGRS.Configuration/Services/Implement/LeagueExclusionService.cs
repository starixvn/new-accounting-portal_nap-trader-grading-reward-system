namespace Fanex.NAP.TGRS.Configuration.Services.Implement
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.Framework.Data;
    using Fanex.NAP.TGRS.Configuration.Criteria.LeagueExclusion;
    using Fanex.NAP.TGRS.Configuration.Models.LeagueExclusion;
    using Fanex.NAP.TGRS.Configuration.Services.Interface;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using System.Collections.Generic;

    public class LeagueExclusionService : TGRSBaseService, ILeagueExclusionService
    {
        public IEnumerable<League> GetLeagues()
        {
            var criteria = new LeagueGetCriteria();

            return GetData<League>(criteria);
        }

        public IEnumerable<League> SearchLeague(string searchString)
        {
            return GetData<League>(new LeagueSearchCriteria { LeagueName = searchString.Replace("\"", "") });
        }

        public ICommandResult UpdateLeagueExclusion(int leagueId, int custId, bool isAdded)
        {
            ICriteria criteria;

            if (isAdded)
            {
                criteria = new LeagueExclusionInsertCriteria { LeagueId = leagueId, UserId = custId };
            }
            else
            {
                criteria = new LeagueExclusionDeleteCriteria { LeagueId = leagueId, UserId = custId };
            }

             return UpdateData(criteria);
        }
    }
}