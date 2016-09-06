namespace Fanex.NAP.TGRS.OSConfiguration.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.EPADeductionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Services.EPADeductionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement;
    using System;
    using System.Web.Mvc;

    public class OSEPADeductionManagementController : TGRSBaseController
    {
        private IEPADeductionManagementService _epaDeductionManagementService;

        public OSEPADeductionManagementController(
            IEPADeductionManagementService epaDeductionService)
        {
            _epaDeductionManagementService = epaDeductionService;
        }

        public ActionResult Index()
        {
            DateTime minDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);
            minDate = minDate < AppSettings.AvailableDate ? AppSettings.AvailableDate : minDate;

            ViewBag.MinDate = minDate;
            ViewBag.DefaultFromDate = DateTime.Today.AddDays(AppSettings.PerformanceDefaultDayRange * -1);
            ViewBag.DefaultToDate = DateTime.Today.AddDays(-1);
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;
            return View();
        }

        //[NapAuth(FunctionKey = TGRSFunctionKeys.OSEPADeductionManagement, Policy = Constant.Policy.Read)]
        [HttpGet]
        public JsonResult GetEPADeductionReport(GetAllEPADeductionCriteria criteria)
        {
            criteria.TraderName = criteria.TraderName ?? string.Empty;

            var result = _epaDeductionManagementService.GetEPADeductionReport(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSEPADeductionManagement, Policy = Constant.Policy.Read)]
        [HttpGet]
        public JsonResult GetEPADeductionHistory()
        {
            return null;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSEPADeductionManagement, Policy = Constant.Policy.Host)]
        [HttpPost]
        public JsonResult DeleteEPADeductionHistory()
        {
            return null;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSEPADeductionManagement, Policy = Constant.Policy.Read)]
        [HttpGet]
        public JsonResult GetErrorHistory()
        {
            return null;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSEPADeductionManagement, Policy = Constant.Policy.Host)]
        [HttpPost]
        public JsonResult DeleteErrorHistory()
        {
            return null;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSEPADeductionManagement, Policy = Constant.Policy.Read)]
        [HttpGet]
        public JsonResult GetLeaveHistory()
        {
            return null;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSEPADeductionManagement, Policy = Constant.Policy.Host)]
        [HttpPost]
        public JsonResult DeleteLeaveHistory()
        {
            return null;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSEPADeductionManagement, Policy = Constant.Policy.Read)]
        [HttpGet]
        public JsonResult GetErrorTypes()
        {
            var errorTypes = _epaDeductionManagementService.GetErrorTypes(new GetAllIssueCriteria());

            return Json(errorTypes, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSEPADeductionManagement, Policy = Constant.Policy.Host)]
        [HttpPost]
        public JsonResult InsertEPADeduction()
        {
            return null;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSEPADeductionManagement, Policy = Constant.Policy.Host)]
        [HttpPost]
        public JsonResult InsertError()
        {
            return null;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSEPADeductionManagement, Policy = Constant.Policy.Host)]
        [HttpPost]
        public JsonResult InsertLeave()
        {
            return null;
        }
    }
}
