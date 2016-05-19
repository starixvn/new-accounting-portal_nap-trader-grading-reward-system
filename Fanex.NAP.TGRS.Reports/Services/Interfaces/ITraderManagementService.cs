namespace Fanex.NAP.TGRS.Reports.Services.TraderManagement
{
    using System.Collections.Generic;
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Reports.Criteria.TraderManagement;
    using Fanex.NAP.TGRS.Reports.ViewModel.TraderManagement;

    public interface ITraderManagementService
    {
        TraderInfoList GetAllTrader(GetAllTradersCriteria criteria);
    }
}
