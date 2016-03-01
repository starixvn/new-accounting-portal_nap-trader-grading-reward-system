using System.Linq;

namespace Fanex.NAP.TGRS.Configuration.Services.Interface
{
    using System.Collections.Generic;
    using Criteria.TargetedMargin;
    using Framework.Command;
    using Framework.Data;
    using Models.TargetedMargin;

    public interface ITargetedMarginService
    {
        IEnumerable<IGrouping<string, TargetedMarginWithShift>> GetMargin(ICriteria criteria);

        ICommandResult UpdateTargetedMargin(UpdateTargetedMarginCriteria criteria);
    }
}