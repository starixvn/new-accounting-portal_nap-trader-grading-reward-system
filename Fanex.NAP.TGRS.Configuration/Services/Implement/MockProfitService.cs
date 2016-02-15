using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Fanex.NAP.TGRS.Configuration.ViewModel.ProfitMargin;

namespace Fanex.NAP.TGRS.Configuration.Services.Implement
{
    public class MockProfitService : Interface.IProfitMarginService
    {
        public IEnumerable<ProfitMargin> GetMargin()
        {
            return new ProfitMargin[]
            {
                new ProfitMargin {BetType="abcd",Rate=1 },
                new ProfitMargin {BetType="aaaa",Rate=2 }
            };
        }

        public void UpdateMargin(ProfitMargin margin)
        {
        }
    }
}
