namespace Fanex.NAP.TGRS.Configuration.Services.SystemConfiguration
{
    using Fanex.NAP.TGRS.Configuration.Criteria.BettypeManagement;
    using Fanex.NAP.TGRS.Configuration.Models.BettypeManagement;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using System.Collections.Generic;

    public class BettypeManagementService : TGRSBaseService, IBettypeManagement
    {
        public IEnumerable<Bettype> GetBettypes()
        {
            return GetData<Bettype>(new GetAllBettypeCriteria());
        }
    }
}