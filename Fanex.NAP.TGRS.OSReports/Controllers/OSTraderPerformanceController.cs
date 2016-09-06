namespace Fanex.NAP.TGRS.OSReports.Controllers
{
    using System;
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformance;
    using Fanex.NAP.TGRS.OSReports.Services.Interface;

    public class OSTraderPerformanceController : TGRSBaseController
    {
        private ITraderPerformanceService _service;

        public OSTraderPerformanceController(ITraderPerformanceService service)
        {
            _service = service;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderPerformance, Policy = Constant.Policy.Read)]
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

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderPerformance, Policy = Constant.Policy.Read)]
        public ActionResult GetTraderPerformance(GetTraderPerformanceCriteria criteria)
        {
            criteria.TraderName = criteria.TraderName ?? string.Empty;
            return Json(_service.GetTraderPerformances(criteria), JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderPerformance, Policy = Constant.Policy.Read)]
        public ActionResult GetSportsPerformanceByTrader(GetSportByTraderCriteria criteria)
        {
            return Json(_service.GetSportPerformances(criteria), JsonRequestBehavior.AllowGet);
        }
    }
}