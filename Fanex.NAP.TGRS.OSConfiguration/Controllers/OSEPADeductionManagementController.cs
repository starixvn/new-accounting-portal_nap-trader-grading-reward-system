namespace Fanex.NAP.TGRS.OSConfiguration.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.EPADeductionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Services.EPADeductionManagement;
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
            ViewBag.DefaultToDate = DateTime.Today;
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;
            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSEPADeductionManagement, Policy = Constant.Policy.Read)]
        [HttpGet]
        public JsonResult GetEPADeductionReport(GetAllEPADeductionCriteria criteria)
        {
            criteria.TraderName = criteria.TraderName ?? string.Empty;
            criteria.TraderName = criteria.TraderName.Trim();

            var result = _epaDeductionManagementService.GetEPADeductionReport(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSEPADeductionManagement, Policy = Constant.Policy.Read)]
        [HttpGet]
        public JsonResult GetEPADeductionHistory(GetEPADeductionHistoryCriteria criteria)
        {
            var result = _epaDeductionManagementService.GetEPADeductionHistory(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSEPADeductionManagement, Policy = Constant.Policy.Host)]
        [HttpPost]
        public JsonResult DeleteEPADeductionHistory(DeleteEPADeductionHistoryCriteria criteria)
        {
            criteria.CreatorId = this.CurrentSession.UserId;
            var result = _epaDeductionManagementService.DeleteEPADeductionHistory(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSEPADeductionManagement, Policy = Constant.Policy.Read)]
        [HttpGet]
        public JsonResult GetErrorHistory(GetErrorHistoryCriteria criteria)
        {
            var result = _epaDeductionManagementService.GetErrorHistory(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSEPADeductionManagement, Policy = Constant.Policy.Host)]
        [HttpPost]
        public JsonResult DeleteErrorHistory(DeleteErrorHistoryCriteria criteria)
        {
            criteria.CreatorId = this.CurrentSession.UserId;
            var result = _epaDeductionManagementService.DeleteErrorHistory(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSEPADeductionManagement, Policy = Constant.Policy.Read)]
        [HttpGet]
        public JsonResult GetLeaveHistory(GetLeaveHistoryCriteria criteria)
        {
            var result = _epaDeductionManagementService.GetLeaveHistory(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSEPADeductionManagement, Policy = Constant.Policy.Host)]
        [HttpPost]
        public JsonResult DeleteLeaveHistory(DeleteLeaveHistoryCriteria criteria)
        {
            criteria.CreatorId = this.CurrentSession.UserId;
            var result = _epaDeductionManagementService.DeleteLeaveHistory(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
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
        public JsonResult InsertEPADeduction(InsertPointDeductionCriteria criteria)
        {
            criteria.CreatorId = this.CurrentSession.UserId;
            var insertResult = _epaDeductionManagementService.InsertEPADeduction(criteria);

            return Json(insertResult, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSEPADeductionManagement, Policy = Constant.Policy.Host)]
        [HttpPost]
        public JsonResult InsertError(InsertErrorCriteria criteria)
        {
            criteria.CreatorId = this.CurrentSession.UserId;
            var insertResult = _epaDeductionManagementService.InsertError(criteria);

            return Json(insertResult, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSEPADeductionManagement, Policy = Constant.Policy.Host)]
        [HttpPost]
        public JsonResult InsertLeave(InsertEmergencyLeaveCriteria criteria)
        {
            criteria.CreatorId = this.CurrentSession.UserId;
            var insertResult = _epaDeductionManagementService.InsertLeave(criteria);

            return Json(insertResult, JsonRequestBehavior.AllowGet);
        }
    }
}
