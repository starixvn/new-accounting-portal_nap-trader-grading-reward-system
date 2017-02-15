namespace Fanex.NAP.TGRS.OSConfiguration.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.RegionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Services.RegionManagement;
    using System.Web.Mvc;

    public class OSRegionManagementController : TGRSBaseController
    {
        private readonly IRegionManagementService _regionService;

        [Simplect.Attribute.InjectObject]
        public OSRegionManagementController()
            : this(null)
        {
        }

        public OSRegionManagementController(IRegionManagementService regionService)
        {
            this._regionService = regionService ?? new RegionManagementService();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSRegionManagement, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            ViewBag.HasEditRight = this.HasRight(TGRSFunctionKeys.OSRegionManagement, Constant.Policy.Host);
            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSRegionManagement, Policy = Constant.Policy.Read)]
        [HttpGet]
        public JsonResult GetAllRegion()
        {
            var result = _regionService.GetAllRegion();

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSRegionManagement, Policy = Constant.Policy.Host)]
        [HttpPost]
        public JsonResult InsertRegion(InsertRegionCriteria criteria)
        {
            criteria.RegionName = criteria.RegionName ?? string.Empty;
            criteria.UserId = this.CurrentSession.UserId;

            var result = this._regionService.InsertRegion(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.OSRegionManagement, Policy = Constant.Policy.Host)]
        public JsonResult UpdateRegion(UpdateRegionCriteria criteria)
        {
            criteria.RegionName = criteria.RegionName ?? string.Empty;
            criteria.UserId = this.CurrentSession.UserId;

            var result = this._regionService.UpdateRegion(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}