namespace Fanex.NAP.TGRS.WebAPI.Service
{
    using Fanex.NAP.TGRS.WebAPI.Utilities;
    using Fanex.NAP.TGRS.WebAPI.Criteria;
    using Fanex.NAP.TGRS.WebAPI.Model;
    using System.Collections.Generic;

    public class TraderPerformanceService
    {
        public IEnumerable<TraderPerformanceDetails> GetTraderPerformanceDetails(GetPerformanceDetailsCriteria criteria )
        {
            return DataService.GetData<TraderPerformanceDetails>(criteria);
        }

        public IEnumerable<MultipleMatchesDetails> GetMultipleMatchesDetails(GetMultipleMatchesCriteria criteria)
        {
            return DataService.GetData<MultipleMatchesDetails>(criteria);
        }
    }
}