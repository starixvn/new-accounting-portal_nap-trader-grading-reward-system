namespace Fanex.NAP.TGRS.Reports.Services.TraderManagement
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Reports.Criteria.TraderManagement;
    using Fanex.NAP.TGRS.Reports.Models.TraderManagement;
    using Fanex.NAP.TGRS.Reports.ViewModel.TraderManagement;

    public class TraderManagementService : TGRSBaseService, ITraderManagementService
    {
        public TraderInfoList GetAllTrader(GetAllTradersCriteria criteria)
        {
            TraderInfoList result = null;

            var rawData = this.GetData<TraderInfo>(criteria);

            if (rawData != null)
            {
                result = new TraderInfoList();

                foreach (var trader in rawData)
                {
                    var traderInfoItem = new TraderInfoItem(trader);

                    result.Add(traderInfoItem);
                }
            }

            return result;
        }
    }
}
