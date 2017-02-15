namespace Fanex.NAP.TGRS.OSConfiguration.Services.RegionManagement
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.RegionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.RegionManagement;
    using System.Collections.Generic;
    using System.Linq;

    public class RegionManagementService : TGRSBaseService, IRegionManagementService
    {
        public IList<RegionInfo> GetAllRegion()
        {
            var criteria = new GetAllRegionsCriteria();
            var result = this.GetData<RegionInfo>(criteria).ToList();

            return result;
        }

        public ICommandResult InsertRegion(InsertRegionCriteria criteria)
        {
            return this.UpdateData(criteria);
        }

        public ICommandResult UpdateRegion(UpdateRegionCriteria criteria)
        {
            return this.UpdateData(criteria);
        }
    }
}
