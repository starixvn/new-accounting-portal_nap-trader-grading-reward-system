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
    using System.Web.Mvc;

    [NapAuth(FunctionKey = TGRSFunctionKeys.OSBasketballPerformance, Policy = Constant.Policy.Read)]
    public class OSBasketballPerformanceController : TGRSBaseController
    {
        private const string BetTypePerformanceDetail = @"~\Areas\OSReports\ExcelTemplates\OSBasketballPerformance\BetTypePerformance.xls";
        private readonly IBasketballBetTypeService _basketballBetTypeService;

        public OSBasketballPerformanceController()
        {
            _basketballBetTypeService = new BasketballBetTypeService();
        }
        
        public ActionResult Index()
        {
            return RedirectToAction("BettypePerformance");
        }
        
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
        
        [HttpPost]
        public ActionResult GetBettypePerformance(GetBettypePerformanceCriteria criteria)
        {
            var bettypePerformance = _basketballBetTypeService.GetBettypePerformance(criteria);

            return Json(bettypePerformance, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        public ActionResult GetBetChoiceOfBetType(GetBetChoiceOfBettypeCriteria criteria)
        {
            var betChoices = _basketballBetTypeService.GetBetChoiceOfBettype(criteria);

            return Json(betChoices, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetQuarterOfBettypeBetChoice(GetQuarterOfBettypeBetChoiceCriteria criteria)
        {
            if (criteria.IsHdp)
            {
                var hdpCriteria = new GetHdpOfBettypeBetChoiceCriteria
                {
                    BetChoice = criteria.BetChoice,
                    Bettype = criteria.Bettype,
                    FromDate = criteria.FromDate,
                    LeagueGroupIds = criteria.LeagueGroupIds,
                    LeagueName = criteria.LeagueName,
                    LiveType = criteria.LiveType,
                    ToDate = criteria.ToDate,
                };

                var hdp = _basketballBetTypeService.GetHdpOfBettypeBetChoice(hdpCriteria);

                return Json(hdp, JsonRequestBehavior.AllowGet);
            }

            var quarters = _basketballBetTypeService.GetQuarterOfBettypeBetChoice(criteria);

            return Json(quarters, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetLeagueOfBettypeBetChoiceQuarter(GetLeagueOfBettypeBetChoiceQuarterCriteria criteria)
        {
            var leagues = _basketballBetTypeService.GetLeagueOfBettypeBetChoiceQuarter(criteria);

            return Json(leagues, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetLeagueOfBettypeBetChoice(GetLeagueOfBettypeBetChoiceCriteria criteria)
        {
            var leagues = _basketballBetTypeService.GetLeagueOfBettypeBetChoice(criteria);

            return Json(leagues, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        public ActionResult GetTraderOfBettype(GetTraderOfBettypeCriteria criteria)
        {
            var traders = _basketballBetTypeService.GetTraderOfBettype(criteria);

            return Json(traders, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        public ActionResult GetMatchOfBettypeTrader(GetMatchOfBettypeTraderCriteria criteria)
        {
            var matches = _basketballBetTypeService.GetMatchOfBettypeTrader(criteria);

            return Json(matches, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        public ActionResult GetLeagueOfBettype(GetLeagueOfBettypeCriteria criteria)
        {
            var leagues = _basketballBetTypeService.GetLeagueOfBettype(criteria);

            return Json(leagues, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        public ActionResult GetBetChoiceOfBettypeLeague(GetBetChoiceOfBettypeLeagueCriteria criteria)
        {
            var betChoices = _basketballBetTypeService.GetBetChoiceOfBettypeLeague(criteria);

            return Json(betChoices, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetQuarterOfBettypeLeagueBetChoice(GetQuarterOfBettypeLeagueBetChoiceCriteria criteria)
        {
            var quarters = _basketballBetTypeService.GetQuarterOfBettypeLeagueBetChoice(criteria);

            return Json(quarters, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetTraderOfBettypeLeague(GetTraderOfBettypeLeagueCriteria criteria)
        {
            var traders = _basketballBetTypeService.GetTraderOfBettypeLeague(criteria);

            return Json(traders, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        public ActionResult GetMatchOfBettypeLeagueTrader(GetMatchOfBettypeLeagueTraderCriteria criteria)
        {
            var matches = _basketballBetTypeService.GetMatchOfBettypeLeagueTrader(criteria);

            return Json(matches, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult ExportBettypePerformance(GetBettypePerformanceCriteria criteria)
        {
            string templatePath = Server.MapPath(BetTypePerformanceDetail);

            _basketballBetTypeService.ExportBetTypePerformance(CurrentSession.UserId, criteria, templatePath);

            return new EmptyResult();
        }

        public ActionResult LeaguePerformance()
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

        [HttpPost]
        public ActionResult GetLeaguePerformance(GetLeaguePerformanceCriteria criteria)
        {
            var leaguePerformance = _basketballBetTypeService.GetLeaguePerformance(criteria);

            return Json(leaguePerformance, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetMatchOfLeaguePerformance(GetMatchOfLeaguePerformanceCriteria criteria)
        {
            var leaguePerformance = _basketballBetTypeService.GetMatchOfLeaguePerformance(criteria);

            return Json(leaguePerformance, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetBetTypeOfLeaguePerformance(GetBetTypeOfLeaguePerformanceCriteria criteria)
        {
            var leaguePerformance = _basketballBetTypeService.GetBetTypeOfLeaguePerformance(criteria);

            return Json(leaguePerformance, JsonRequestBehavior.AllowGet);
        }

    }
}
