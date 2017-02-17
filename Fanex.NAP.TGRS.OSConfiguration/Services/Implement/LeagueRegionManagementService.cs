namespace Fanex.NAP.TGRS.OSConfiguration.Services.LeagueRegionManagement
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.LeagueRegionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.LeagueRegionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.SettingManagement;
    using System.Collections.Generic;

    public class LeagueRegionManagementService : TGRSBaseService, ILeagueRegionManagementService
    {
        public IEnumerable<LeagueRegionInfo> GetAllLeagueRegion(GetLeagueRegionCriteria criteria)
        {
            return GetData<LeagueRegionInfo>(criteria);
        }

        public ICommandResult InsertLeagueRegion(InsertLeagueRegionCriteria criteria)
        {
            return this.UpdateData(criteria);
        }

        public ICommandResult UpdateLeagueRegion(UpdateLeagueRegionCriteria criteria)
        {
            return this.UpdateData(criteria);
        }

        public IEnumerable<Sport> GetAllSport()
        {
            var result = this.GetData<Sport>(new GetAllSportsCriteria());

            return result != null ? result : new List<Sport>();
        }
    }
}