namespace Fanex.MAP.TGRS.WebAPI.Controllers
{
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
            return Json(_service.GetLeaguePerformance(param));
        }      
    }
}