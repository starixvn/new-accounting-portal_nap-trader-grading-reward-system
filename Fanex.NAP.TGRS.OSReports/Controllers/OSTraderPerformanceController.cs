namespace Fanex.NAP.TGRS.OSReports.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformance;
    using Fanex.NAP.TGRS.OSReports.Services.Interface;
    using System;
    using System.Web.Mvc;

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
            criteria.TraderName = criteria.TraderName.Trim();
            return Json(new { data = _service.GetTraderPerformances(criteria) , fuck = 1 }, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderPerformance, Policy = Constant.Policy.Read)]
        public ActionResult GetSportsPerformanceByTrader(GetSportByTraderCriteria criteria)
        {
            var result = _service.GetSportPerformances(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderPerformance, Policy = Constant.Policy.Read)]
        public ActionResult GetRegionsPerformanceByTrader(GetRegionByTraderCriteria criteria)
        {
            var result = _service.GetRegionPerformances(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderPerformance, Policy = Constant.Policy.Read)]
        public ActionResult GetAllSports()
        {
            var sports = _service.GetAllSport();

            return Json(sports, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderPerformance, Policy = Constant.Policy.Read)]
        public ActionResult GetLeaguePerformance(GetTraderSportLeaguePerformanceCriteria criteria)
        {
            var result = _service.GetTraderSportLeaguePerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderPerformance, Policy = Constant.Policy.Read)]
        public ActionResult GetBettypePerformance(GetTraderSportLeagueBettypePerformanceCriteria criteria)
        {
            var result = _service.GetTraderSportLeagueBettypePerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderPerformance, Policy = Constant.Policy.Read)]
        public ActionResult GetMatchPerformance(GetTraderMatchPerformanceCriteria criteria)
        {
            var data =
                _service
                .GetTraderMatchPerformance(criteria);

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderPerformance, Policy = Constant.Policy.Read)]
        public ActionResult GetMatchBettypePerformanace(GetMatchBettypeCriteria criteria)
        {
            return Json(_service.GetMatchBettypes(criteria), JsonRequestBehavior.AllowGet);
        }
    }
}