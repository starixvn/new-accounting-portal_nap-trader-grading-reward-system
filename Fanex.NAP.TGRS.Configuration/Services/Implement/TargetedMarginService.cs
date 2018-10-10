using System.Linq;

namespace Fanex.NAP.TGRS.Configuration.Services.Implement
{
    using System.Collections.Generic;
    using Core.BaseClasses;
    using Criteria.TargetedMargin;
    using Framework.Command;
    using Data.Repository;
    using Models.TargetedMargin;

    public class TargetedMarginService : TGRSBaseService, Interface.ITargetedMarginService
    {
        public IEnumerable<IGrouping<string, TargetedMarginWithShift>> GetMargin(ICriteria criteria)
        {
            return GetData<TargetedMarginWithShift>(criteria).GroupBy(m => m.BetType);
        }

        public ICommandResult UpdateTargetedMargin(UpdateTargetedMarginCriteria criteria)
        {
            return UpdateData(criteria);
        }
    }
}