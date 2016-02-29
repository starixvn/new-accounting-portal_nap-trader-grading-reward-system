using System.Linq;

namespace Fanex.NAP.TGRS.Configuration.Services.Implement
{
    using System.Collections.Generic;
    using Core.BaseClasses;
    using Criteria.TargetedMargin;
    using Framework.Command;
    using Framework.Data;
    using Models.TargetedMargin;

    public class TargetedMarginService : TGRSBaseService, Interface.ITargetedMarginService
    {
        public IEnumerable<IGrouping<string, TargetedMargin>> GetMargin(ICriteria criteria)
        {
            return GetData<TargetedMargin>(criteria).GroupBy(m => m.BetType);
        }

        public ICommandResult UpdateTargetedMargin(UpdateTargetedMarginCriteria criteria)
        {
            return UpdateData(criteria);
        }
    }
}