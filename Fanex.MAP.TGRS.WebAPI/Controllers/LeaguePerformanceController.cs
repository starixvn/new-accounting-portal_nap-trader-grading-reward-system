namespace Fanex.MAP.TGRS.WebAPI.Controllers
{
    using Fanex.Logging;
    using Fanex.Logging.Extensions;
    using Fanex.Logging.Extensions.Database;
    using Fanex.MAP.TGRS.WebAPI.Model.LeaguePerformance;
    using Fanex.MAP.TGRS.WebAPI.Service;
    using Fanex.MAP.TGRS.WebAPI.ViewModel;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Http;
    using System.Web.Http.Results;

    public class LeaguePerformanceController : ApiController
    {
        private readonly ILeaguePerformanceService _service;

        public LeaguePerformanceController()
        {
            _service = new LeaguePerformanceService();
        }

        [HttpPost]
        public JsonResult<IEnumerable<LeaguePerformanceModel>> GetLeaguePerformance([FromBody] GetLeaguePerformanceParam param)
        {
            var result = Enumerable.Empty<LeaguePerformanceModel>();

            try
            {               
                result = _service.GetLeaguePerformance(param);
            }
            catch (Exception ex)
            {            
                var logMessage = new LogMessage(ex.Message)
                   .AddMessage("TGRS API - Get League Performance")
                   .AddSection("Data Info", DatabaseInfoGetters.GetDbExceptionInfo(ex))
                   .AddSection("Exception Info", CommonInfoGetters.GetExceptionInfo(ex)).ToString();

                LogService.Error(logMessage);
            }

            return Json(result);
        }      
    }
}