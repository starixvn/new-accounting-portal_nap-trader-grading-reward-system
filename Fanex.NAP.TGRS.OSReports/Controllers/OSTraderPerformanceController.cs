using System;
using System.Web.Mvc;
using Fanex.NAP.TGRS.Core.BaseClasses;
using Fanex.NAP.TGRS.Core.Configurations;
using Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformance;
using Fanex.NAP.TGRS.OSReports.Services.Interface;

namespace Fanex.NAP.TGRS.OSReports.Controllers
{
    public class OSTraderPerformanceController : TGRSBaseController
    {
        ITraderPerformanceService _service;

        public OSTraderPerformanceController(ITraderPerformanceService service)
        {
            _service = service;
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

        public ActionResult GetTraderPerformance(GetTraderPerformanceCriteria criteria)
        {
            return Json(_service.GetTraderPerformances(criteria), JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetSportsPerformanceByTrader(GetSportByTraderCriteria criteria)
        {
            return Json(_service.GetSportPerformances(criteria), JsonRequestBehavior.AllowGet);
        }
    }
}