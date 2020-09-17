namespace Fanex.NAP.TGRS.OSReports.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.OSReports.Criteria.BasketballPerformance;
    using Fanex.NAP.TGRS.OSReports.Services.Implement;
    using Fanex.NAP.TGRS.OSReports.Services.Interface;
    using System;
    using System.Collections.Generic;
    using System.Web.Mvc;

    public class OSBasketballPerformanceController : TGRSBaseController
    {
        private readonly IBasketballBetTypeService _basketballBetTypeService;

        public OSBasketballPerformanceController()
        {
            _basketballBetTypeService = new BasketballBetTypeService();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSBasketballPerformance, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return RedirectToAction("BettypePerformance");
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSBasketballPerformance, Policy = Constant.Policy.Read)]
        public ActionResult BettypePerformance()
        {
            DateTime minDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);
            minDate = minDate < AppSettings.AvailableDate ? AppSettings.AvailableDate : minDate;

            ViewBag.MinDate = minDate;
            ViewBag.DefaultFromDate = DateTime.Today.AddDays(AppSettings.PerformanceDefaultDayRange * -1);
            ViewBag.DefaultToDate = DateTime.Today.AddDays(-1);
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;
            ViewBag.LeagueGroups = this._basketballBetTypeService.GetLeagueGroups();
            ViewBag.GroupBetTypes = this._basketballBetTypeService.GetGroupBetTypes();

            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSBasketballPerformance, Policy = Constant.Policy.Read)]
        [HttpGet]
        public ActionResult GetBettypePerformance(GetBettypePerformanceCriteria criteria)
        {
            var bettypePerformance = _basketballBetTypeService.GetBettypePerformance(criteria);

            return Json(bettypePerformance, JsonRequestBehavior.AllowGet);
        }
    }
}
