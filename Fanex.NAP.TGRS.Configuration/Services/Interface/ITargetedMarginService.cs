namespace Fanex.NAP.TGRS.Configuration.Services.Interface
{
    using Framework.Command;
    using Model.TargetedMargin;
    using System.Collections.Generic;

    public interface ITargetedMarginService
    {
        IEnumerable<TargetedMargin> GetMargin();

        ICommandResult UpdateMargin(TargetedMargin margin);
    }
}