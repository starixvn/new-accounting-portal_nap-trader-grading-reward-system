using System;
using System.Web.Mvc;
using Fanex.NAP.TGRS.Core.BaseClasses;
using Fanex.NAP.TGRS.Core.Configurations;

namespace Fanex.NAP.TGRS.OSReports.Controllers
{
    public class OSTraderReportController : TGRSBaseController
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
    }
}