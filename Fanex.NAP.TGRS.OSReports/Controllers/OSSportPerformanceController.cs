namespace Fanex.NAP.TGRS.OSReports.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.OSReports.Criteria.SportPerformance;
    using Fanex.NAP.TGRS.OSReports.Services.Implement;
    using Fanex.NAP.TGRS.OSReports.Services.Interface;
    using System;
    using System.Web.Mvc;

    public class OSSportPerformanceController : TGRSBaseController
    {
        private readonly ISportPerformanceService _sportPerformanceService;

        public OSSportPerformanceController()
        {
            _sportPerformanceService = new SportPerformanceService();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSSportPerformance, Policy = Constant.Policy.Read)]
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

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSSportPerformance, Policy = Constant.Policy.Read)]
        public ActionResult GetAllSports()
        {
            var sports = _sportPerformanceService.GetAllSport();

            return Json(sports, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSSportPerformance, Policy = Constant.Policy.Read)]
        [HttpGet]
        public ActionResult GetSportPerformance(GetSportPerformanceCriteria criteria)
        {
            var sportPerformance = _sportPerformanceService.GetSportPerformance(criteria);

            return Json(sportPerformance, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSSportPerformance, Policy = Constant.Policy.Read)]
        [HttpGet]
        public ActionResult GetLeaguePerformance(GetLeaguePerformanceCriteria criteria)
        {
            var leaguePerformance = _sportPerformanceService.GetLeaguePerformance(criteria);

            return Json(leaguePerformance, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSSportPerformance, Policy = Constant.Policy.Read)]
        [HttpGet]
        public ActionResult GetBettypePerformance(GetBettypePerformanceCriteria criteria)
        {
            var bettypePerformance = _sportPerformanceService.GetBettypePerformance(criteria);

            return Json(bettypePerformance, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSSportPerformance, Policy = Constant.Policy.Read)]
        public ActionResult GetRegionsPerformanceBySport(GetRegionBySportCriteria criteria)
        {
            var result = _sportPerformanceService.GetRegionPerformances(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}