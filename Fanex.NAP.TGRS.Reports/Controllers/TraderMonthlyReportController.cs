namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Reports.Criteria.TraderPerformanceMonthly;
    using Fanex.NAP.TGRS.Reports.Services.Implements;
    using Fanex.NAP.TGRS.Reports.Services.Interfaces;
    using Newtonsoft.Json.Linq;
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
            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.TraderPerformanceMonthly, Policy = Constant.Policy.Read)]
        public ActionResult GetMonthlyData(MonthlyFilter filter)
        {
            try
            {
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
        public ActionResult ExportExcel(MonthlyFilter filter)
        {
            var file = _service.ExportExcel(Server.MapPath("~/Areas/Reports/ExcelTemplates/PerformanceMonthly/template.xlsx"), filter);

            return File(file, "application/vnd.ms-excel", "Trader performance monthly.xlsx");
        }
    }
}