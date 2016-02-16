namespace Fanex.NAP.TGRS.Configuration.Services.Interface
{
    using System.Collections.Generic;
    using Criteria.TargetedMargin;
    using Framework.Command;
    using Models.TargetedMargin;

    public interface ITargetedMarginService
    {
        IEnumerable<TargetedMargin> GetMargin();

        ICommandResult UpdateTargetedMargin(UpdateTargetedMarginCriteria criteria);
    }
}