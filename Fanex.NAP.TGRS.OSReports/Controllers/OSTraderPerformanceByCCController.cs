namespace Fanex.NAP.TGRS.OSReports.Controllers
{
    using Fanex.Logging;
    using Fanex.Logging.Extensions;
    using Fanex.Logging.Extensions.Database;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformanceByCC;
    using Fanex.NAP.TGRS.OSReports.Services.Interface;
    using System;
    using System.Web.Mvc;

    public class OSTraderPerformanceByCCController : TGRSBaseController
    {
        private readonly ITraderPerformanceByCCService _service;

        public OSTraderPerformanceByCCController(ITraderPerformanceByCCService service)
        {
            _service = service;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderPerformanceByCC, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            try
            {
                DateTime minDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);
                minDate = minDate < AppSettings.AvailableDate ? AppSettings.AvailableDate : minDate;

                var ctsCustomerClass = _service.GetCTSCustomerClassFilter();

                var sports = _service.GetSportFilter();

                ViewBag.MinDate = minDate;
                ViewBag.DefaultFromDate = DateTime.Today.AddDays(AppSettings.PerformanceDefaultDayRange * -1);
                ViewBag.DefaultToDate = DateTime.Today.AddDays(-1);
                ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;
                ViewBag.Sports = sports;
                ViewBag.CustomerClassGroup = ctsCustomerClass.CustomerClassGroup;
                ViewBag.ClassList = ctsCustomerClass.ClassList;
            }
            catch(Exception ex)
            {
                var logMessage = new LogMessage(ex.Message)
                                  .AddSection("Data Info", DatabaseInfoGetters.GetDbExceptionInfo(ex))
                                  .AddSection("Exception Info", CommonInfoGetters.GetExceptionInfo(ex)).ToString();

                LogService.Error(logMessage);
            }
            

            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderPerformanceByCC, Policy = Constant.Policy.Read)]
        public ActionResult GetTraderPerformanceByCC(GetTraderPerformanceByCCCriteria criteria)
        {
            criteria.TraderName = criteria.TraderName ?? string.Empty;
            criteria.TraderName = criteria.TraderName.Trim();

            var data = _service.GetTraderPerformancesByCC(criteria);

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderPerformanceByCC, Policy = Constant.Policy.Read)]
        public ActionResult ExportExcel(ExportExcelTradePerfCCViewModel criteria)
        {
            var templatePath = Server.MapPath("~/Areas/OSReports/ExcelTemplates/OSTraderPerformanceByCC/TraderPerformanceByCC.xls");

             _service.ExportTradePerformanceCC(criteria, templatePath);

            return new EmptyResult();
        }
    }
}