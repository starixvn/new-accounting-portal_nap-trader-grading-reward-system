namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.Criteria.TraderPerformanceMonthly;
    using Fanex.NAP.TGRS.Reports.Services.Implements;
    using Fanex.NAP.TGRS.Reports.Services.Interfaces;
    using NAP.Core.Web;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Web.Mvc;

    public class TraderMonthlyReportController : TGRSBaseController
    {
        private ITraderMonthlyReport _service;

        public TraderMonthlyReportController()
        {
            _service = new TraderMonthlyReportService();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.TraderPerformanceMonthly, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            var shifts = _service.GetShifts();
            ViewBag.User = this.CurrentSession.Username;

            return View(shifts);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.TraderPerformanceMonthly, Policy = Constant.Policy.Read)]
        public ActionResult GetMonthlyData(GetTraderPerformanceMonthlyCriteria filter)
        {
            try
            {
                filter.IsExcludeLeagues = AppSession.IsExcludingLeagues;
                filter.LeagueName = filter.LeagueName ?? string.Empty;
                filter.TraderName = filter.TraderName ?? string.Empty;
                var data = _service.GetReports(filter);
                var json = JObject.FromObject(data);
                return Content(json.ToString(), "application/json");
            }
            catch (System.Exception e)
            {
                return Json(new { msg = e.Message, stack = e.StackTrace });
            }
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.TraderPerformanceMonthly, Policy = Constant.Policy.Read)]
        public ActionResult ExportExcel(GetTraderPerformanceMonthlyCriteria filter)
        {
            try
            {
                filter.IsExcludeLeagues = AppSession.IsExcludingLeagues;
                filter.LeagueName = filter.LeagueName ?? string.Empty;
                var file = _service.ExportExcel(Server.MapPath("~/Areas/Reports/ExcelTemplates/PerformanceMonthly/MonthlyPerformance.xlsx"), filter);
                var fileName = "Trader_Monthly_Performance_" + DateTime.Now.ToShortFormatedDateForFileName() + ".xlsx";

                return File(file, "application/vnd.ms-excel", fileName);
            }
            catch (Exception ex)
            {
                return Json(new { ex.Message, ex.StackTrace }, JsonRequestBehavior.AllowGet);
            }
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.TraderPerformanceMonthly, Policy = Constant.Policy.Read)]
        public ActionResult WeekPerformance()
        {
            return View();
        }
    }
}