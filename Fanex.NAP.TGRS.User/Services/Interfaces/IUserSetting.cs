namespace Fanex.NAP.TGRS.User.Services.Interfaces
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.Permission;    
    using Fanex.NAP.TGRS.User.Criteria.Setting;
    using System.Collections.Generic;

    public interface IUserSetting
    {
        IEnumerable<BetTypeInfo> GetDefaultBettypes(int userid, BettypeViewPermission permission);

        ICommandResult UpdateDefaultBettypes(UpdateDefaultBettypeCriteria criteria);
    }
}