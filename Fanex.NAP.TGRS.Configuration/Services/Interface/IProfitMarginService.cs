using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Fanex.NAP.TGRS.Configuration.ViewModel.ProfitMargin;

namespace Fanex.NAP.TGRS.Configuration.Services.Interface
{
    public interface IProfitMarginService
    {
        IEnumerable<ProfitMargin> GetMargin();

        void UpdateMargin(ProfitMargin margin);
    }
}
