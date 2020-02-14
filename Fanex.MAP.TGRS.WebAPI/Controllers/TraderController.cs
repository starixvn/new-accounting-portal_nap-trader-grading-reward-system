namespace Fanex.NAP.TGRS.WebAPI.Controllers
{
    using Fanex.NAP.TGRS.WebAPI.Criteria;
    using Fanex.NAP.TGRS.WebAPI.Model;
    using Fanex.NAP.TGRS.WebAPI.Service;
    using System.Collections.Generic;
    using System.Web.Http;

    [AllowAnonymous]
    public class TraderController : ApiController
    {
        private readonly TraderPerformanceService _traderPerformanceService;

        public TraderController()
        {
            _traderPerformanceService = new TraderPerformanceService();
        }

        [HttpGet]
        public string TestTGRSWebAPI()
        {
            return "I am here!";
        }

        [HttpPost]
        public IEnumerable<TraderPerformanceDetails> GetPerformanceDetails(GetPerformanceDetailsCriteria criteria)
        {
            return _traderPerformanceService.GetTraderPerformanceDetails(criteria);
        }

        [HttpPost]
        public IEnumerable<MultipleMatchesDetails> GetMultipleMatches(GetMultipleMatchesCriteria criteria)
        {
            return _traderPerformanceService.GetMultipleMatchesDetails(criteria);
        }
    }
}
