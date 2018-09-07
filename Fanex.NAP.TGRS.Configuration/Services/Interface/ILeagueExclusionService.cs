namespace Fanex.NAP.TGRS.Configuration.Services.Interface
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Configuration.Models.LeagueExclusion;
    using System.Collections.Generic;

    public interface ILeagueExclusionService
    {
        IEnumerable<League> GetLeagues();

        ICommandResult UpdateLeagueExclusion(int leagueId, int custId, bool isAdded);

        IEnumerable<League> SearchLeague(string searchString);
    }
}