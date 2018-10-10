namespace Fanex.NAP.TGRS.OSConfiguration.Services.RegionManagement
{
    using Fanex.NAP.Framework.Command;
    using Fanex.Data.Repository;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.RegionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.RegionManagement;
    using System.Collections.Generic;

    public interface IRegionManagementService
    {
        IList<RegionInfo> GetAllRegion();

        ICommandResult InsertRegion(InsertRegionCriteria criteria);

        ICommandResult UpdateRegion(UpdateRegionCriteria criteria);
    }
}
