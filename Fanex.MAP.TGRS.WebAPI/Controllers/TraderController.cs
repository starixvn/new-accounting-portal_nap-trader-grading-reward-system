namespace Fanex.NAP.TGRS.WebAPI.Controllers
{
    using Fanex.NAP.TGRS.WebAPI.Criteria;
    using Fanex.NAP.TGRS.WebAPI.Model;
    using Fanex.NAP.TGRS.WebAPI.Service;
    using System.Collections.Generic;
    using System.Linq;
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
            /*
            GetPerformanceDetailsCriteria criteria = new GetPerformanceDetailsCriteria
            {
                FromDate = new System.DateTime(2010, 01, 01),
                ToDate = new System.DateTime(2010, 01, 01),
                MajorBettypeIds = "1,3,7,8",
                TraderIds = "772191"
            };

            //return "I am here!";
            System.Diagnostics.Stopwatch stopWatch = new System.Diagnostics.Stopwatch();
            stopWatch.Start();
            var result = _traderPerformanceService.GetTraderPerformanceDetails(criteria);
            stopWatch.Stop();

            string sb = string.Format("@@ GetPerformanceDetails # FromDate: {0} # ToDate: {1} # Bettypes: {2} # CustId: {3} -- Takes: {4}", criteria.FromDate, criteria.ToDate, criteria.MajorBettypeIds, criteria.TraderIds, stopWatch.Elapsed);
            System.IO.File.AppendAllText("d:\\WWW\\SPU\\TGRS-WebAPI\\TGRS_WebAPI_Log.txt", sb);
            */
            return "Hello, man!";
        }

        [HttpPost]
        public IEnumerable<TraderPerformanceDetails> GetPerformanceDetails(GetPerformanceDetailsCriteria criteria)
        {
            try
            {
                System.Diagnostics.Stopwatch stopWatch = new System.Diagnostics.Stopwatch();
                stopWatch.Start();
                var result = _traderPerformanceService.GetTraderPerformanceDetails(criteria);
                stopWatch.Stop();

                string sb = string.Format("@@ GetPerformanceDetails # FromDate: {0} # ToDate: {1} # Bettypes: {2} # CustId: {3} -- Takes: {4}", criteria.FromDate, criteria.ToDate, criteria.MajorBettypeIds, criteria.TraderIds, stopWatch.Elapsed);
                System.IO.File.AppendAllText("e:\\WWW\\SPU\\TGRS-WebAPI\\TGRS_WebAPI_Log.txt", sb);

                return (result != null && result.Any()) ? result : new List<TraderPerformanceDetails>();
            }
            catch(System.Exception e)
            {
                string sb = string.Format("@@ GetPerformanceDetails # FromDate: {0} # ToDate: {1} # Bettypes: {2} # CustId: {3} -- Error: {4}", criteria.FromDate, criteria.ToDate, criteria.MajorBettypeIds, criteria.TraderIds, e.Message);
                System.IO.File.AppendAllText("e:\\WWW\\SPU\\TGRS-WebAPI\\TGRS_WebAPI_Log.txt", sb);
                return new List<TraderPerformanceDetails>();
            }
        }

        [HttpPost]
        public IEnumerable<MultipleMatchesDetails> GetMultipleMatches(GetMultipleMatchesCriteria criteria)
        {
            return _traderPerformanceService.GetMultipleMatchesDetails(criteria);
        }
    }
}
