namespace Fanex.NAP.TGRS.OSConfiguration.Controllers
{
    using System;
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;

    public class OSEPADeductionManagementController : TGRSBaseController
    {
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

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSEPADeductionManagement, Policy = Constant.Policy.Read)]
        [HttpGet]
        public JsonResult GetEPADeductionReport()
        { 
            return null;
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
            return null;
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
