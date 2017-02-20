namespace Fanex.NAP.TGRS.OSConfiguration.Controllers
{
    using Core.BaseClasses;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.LeagueRegionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Services.LeagueRegionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Services.RegionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Services.Utility;
    using System.Linq;
    using System.Web.Mvc;

    public class OSLeagueRegionManagementController : TGRSBaseController
    {
        private ILeagueRegionManagementService _leagueRegionManagementService;

        private IRegionManagementService _regionManagementService;

        [Simplect.Attribute.InjectObject]
        public OSLeagueRegionManagementController()
            : this(null, null)
        {
        }

        public OSLeagueRegionManagementController(ILeagueRegionManagementService leagueRegionManagementService, IRegionManagementService regionManagementService)
        {
            _leagueRegionManagementService = leagueRegionManagementService ?? new LeagueRegionManagementService();
            _regionManagementService = regionManagementService ?? new RegionManagementService();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSLeagueRegionManagement, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            ViewBag.HasEditRight = this.HasRight(TGRSFunctionKeys.OSLeagueRegionManagement, Constant.Policy.Host);
            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSLeagueRegionManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetLeagueRegions(GetLeagueRegionCriteria criteria)
        {
            criteria.LeagueName = criteria.LeagueName ?? string.Empty;
            criteria.LeagueName = criteria.LeagueName.Trim();

            var result = _leagueRegionManagementService.GetAllLeagueRegion(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSLeagueRegionManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetSports()
        {
            var result = _leagueRegionManagementService.GetAllSport();

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSLeagueRegionManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetRegions()
        {
            var result = _regionManagementService.GetAllRegion().Select(g => new { RegionName = g.RegionName, RegionId = g.RegionId });

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.OSLeagueRegionManagement, Policy = Constant.Policy.Host)]
        public JsonResult InsertLeagueRegion(InsertLeagueRegionCriteria criteria)
        {
            criteria.CreatorId = SessionUtility.GetCreatorId();

            var result = _leagueRegionManagementService.InsertLeagueRegion(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.OSLeagueRegionManagement, Policy = Constant.Policy.Host)]
        public JsonResult UpdateLeagueRegion(UpdateLeagueRegionCriteria criteria)
        {
            criteria.CreatorId = SessionUtility.GetCreatorId();

            var result = _leagueRegionManagementService.UpdateLeagueRegion(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}