using System.Linq;

namespace Fanex.NAP.TGRS.Configuration.Services.Interface
{
    using System.Collections.Generic;
    using Criteria.TargetedMargin;
    using Framework.Command;
    using Data.Repository;
    using Models.TargetedMargin;

    public interface ITargetedMarginService
    {
        IEnumerable<IGrouping<string, TargetedMarginWithShift>> GetMargin(ICriteria criteria);

        ICommandResult UpdateTargetedMargin(UpdateTargetedMarginCriteria criteria);
    }
}