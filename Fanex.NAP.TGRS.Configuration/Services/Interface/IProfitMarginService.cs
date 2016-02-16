using Fanex.NAP.Framework.Command;
using Fanex.NAP.TGRS.Configuration.ViewModel.ProfitMargin;
using System.Collections.Generic;

namespace Fanex.NAP.TGRS.Configuration.Services.Interface
{
    public interface IMarginService
    {
        IEnumerable<TargetedMargin> GetMargin();

        ICommandResult UpdateMargin(TargetedMargin margin);
    }
}