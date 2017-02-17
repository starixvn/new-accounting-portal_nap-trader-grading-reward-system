namespace Fanex.NAP.TGRS.OSConfiguration.Services.LeagueRegionManagement
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.LeagueRegionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.LeagueRegionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.SettingManagement;
    using System.Collections.Generic;

    public interface ILeagueRegionManagementService
    {
        IEnumerable<Sport> GetAllSport();

        IEnumerable<LeagueRegionInfo> GetAllLeagueRegion(GetLeagueRegionCriteria criteria);

        ICommandResult InsertLeagueRegion(InsertLeagueRegionCriteria criteria);

        ICommandResult UpdateLeagueRegion(UpdateLeagueRegionCriteria criteria);
    }
}