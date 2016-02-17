namespace Fanex.NAP.TGRS.Configuration.Services.Interface
{
    using System.Collections.Generic;
    using Criteria.TargetedMargin;
    using Framework.Command;
    using Models.TargetedMargin;
    using Framework.Data;

    public interface ITargetedMarginService
    {
        IEnumerable<TargetedMargin> GetMargin(ICriteria criteria);

        ICommandResult UpdateTargetedMargin(UpdateTargetedMarginCriteria criteria);
    }
}