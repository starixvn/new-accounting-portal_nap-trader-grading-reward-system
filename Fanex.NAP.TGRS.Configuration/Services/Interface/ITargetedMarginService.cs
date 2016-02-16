namespace Fanex.NAP.TGRS.Configuration.Services.Interface
{
    using Criteria.TargetedMargin;
    using Framework.Command;
    using Models.TargetedMargin;
    using System.Collections.Generic;

    public interface ITargetedMarginService
    {
        IEnumerable<TargetedMargin> GetMargin();

        ICommandResult UpdateTargetedMargin(UpdateTargetedMarginCriteria criteria);
    }
}