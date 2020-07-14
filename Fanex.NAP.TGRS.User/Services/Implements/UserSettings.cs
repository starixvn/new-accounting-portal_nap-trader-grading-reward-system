namespace Fanex.NAP.TGRS.User.Services.Implements
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.Permission;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;
    using Fanex.NAP.TGRS.User.Criteria.Setting;
    using Fanex.NAP.TGRS.User.Services.Interfaces;
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.NAP.Framework.Command;

    public class UserSettings : TGRSBaseService, IUserSetting
    {
        public IEnumerable<BetTypeInfo> GetDefaultBettypes(int userid, BettypeViewPermission permission)
        {
            var criteria = new GetDefaultBettypeCriteria()
            {
                UserId = userid,
                BettypePermission = (int)permission
            };

            return GetData<BetTypeInfo>(criteria);
        }

        public ICommandResult UpdateDefaultBettypes(UpdateDefaultBettypeCriteria criteria)
        {
            return UpdateData(criteria);
        }
    }
}