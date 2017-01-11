namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.Reports.Criteria.NewPerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Services;
    using System;
    using System.Linq;
    using System.Web.Mvc;

    public class NewPerformanceDetailController : TGRSBaseController
    {
        #region Attributes and Constructors

        private const string LeaguePerformanceDetail = @"~\Areas\Reports\ExcelTemplates\NewDetailReports\LeaguePerformance.xls";
        private const string TraderPerformanceDetail = @"~\Areas\Reports\ExcelTemplates\NewDetailReports\TraderPerformance.xls";
        private const string GradePerformanceDetail = @"~\Areas\Reports\ExcelTemplates\NewDetailReports\GradePerformance.xls";
        private const string TeamPerformanceDetail = @"~\Areas\Reports\ExcelTemplates\NewDetailReports\TeamPerformance.xls";
        private const string BetTypePerformanceDetail = @"~\Areas\Reports\ExcelTemplates\NewDetailReports\BetTypePerformance.xls";

        private readonly INewDetailReportService _newDetailReportService;

        [Simplect.Attribute.InjectObject]
        public NewPerformanceDetailController()
            : this(null)
        {
            DateTime minDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);

            minDate = minDate < AppSettings.AvailableDate ? AppSettings.AvailableDate : minDate;

            ViewBag.MinDate = minDate;
            ViewBag.DefaultFromDate = DateTime.Today.AddDays(AppSettings.PerformanceDefaultDayRange * -1);
            ViewBag.DefaultToDate = DateTime.Today.AddDays(-1);
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;
        }

        public NewPerformanceDetailController(INewDetailReportService detailReportService)
        {
            this._newDetailReportService = detailReportService ?? new NewDetailReportService();
        }

        #endregion Attributes and Constructors

        #region League Performance

        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return RedirectToAction("LeaguePerformance");
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult LeaguePerformance()
        {
            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetLeaguePerformance(GetLeaguePerformanceCriteria criteria)
        {
            var result = this._newDetailReportService.GetLeaguePerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult ExportLeaguePerformance(GetLeaguePerformanceCriteria criteria)
        {
            string templatePath = Server.MapPath(LeaguePerformanceDetail);

            this._newDetailReportService.ExportLeaguePerformance(criteria, templatePath);

            return new EmptyResult();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfLeague(GetTraderPerformanceOfLeagueCriteria criteria)
        {
            var result = this._newDetailReportService.GetTraderPerformanceByLeague(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfLeagueTrader(GetMatchPerformanceOfLeagueTraderCriteria criteria)
        {
            var result = this._newDetailReportService.GetMatchPerformanceOfLeagueAndTrader(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetBettypeDetailLeague(GetBettypeDetailLeagueCriteria criteria)
        {
            var result = this._newDetailReportService.GetBettypePerformanceOfLeagueTraderAndMatch(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfLeague(GetMatchPerformanceOfLeagueCriteria criteria)
        {
            var result = this._newDetailReportService.GetMatchPerformanceOfLeague(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetBettypePerformanceOfLeagueMatch(GetBetTypePerformanceOfLeagueMatchCriteria criteria)
        {
            var result = this._newDetailReportService.GetBettypePerformanceOfLeagueAndMatch(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        #endregion League Performance

        #region Trader Performance

        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult TraderPerformance()
        {
            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformance(GetTraderPerformanceCriteria criteria)
        {
            var traderPerformance = _newDetailReportService.GetTraderPerformance(criteria);

            return Json(traderPerformance, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderMatchPerformance(GetTraderMatchPerformanceCriteria criteria)
        {
            var traderMatchPerformance = _newDetailReportService.GetTraderMatchPerformance(criteria);

            return Json(traderMatchPerformance.GroupBy(l => l.LeagueId), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderMatchBettypePerformance(GetTraderMatchBettypePerformanceCriteria criteria)
        {
            var traderMatchBettypePerformance = _newDetailReportService.GetTraderMatchBettypePerformance(criteria);

            return Json(traderMatchBettypePerformance, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult ExportTraderPerformance(GetTraderPerformanceCriteria criteria)
        {
            return new EmptyResult();
        }

        #endregion Trader Performance

        #region Grade Performance

        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult GradePerformance()
        {
            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetGradePerformance(GetGradePerformanceCriteria criteria)
        {
            var result = this._newDetailReportService.GetGradePerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfGrade(GetTraderPerformanceOfGradeCriteria criteria)
        {
            var result = this._newDetailReportService.GetGradeTraderPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfGradeByLeague(GetTraderPerformanceOfGradeByLeagueCriteria criteria)
        {
            var result = this._newDetailReportService.GetGradeLeagueTraderPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetLeaguePerformanceOfGrade(GetLeaguePerformanceOfGradeCriteria criteria)
        {
            var result = this._newDetailReportService.GetGradeLeaguePerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfGradeTrader(GetMatchPerformanceOfGradeTraderCriteria criteria)
        {
            var result = _newDetailReportService.GetGradeTraderMatchPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfGradeLeagueTrader(GetMatchPerformanceOfGradeLeagueTraderCriteria criteria)
        {
            var result = this._newDetailReportService.GetGradeLeagueTraderMatchPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetBettypeDetailGrade(GetBetTypePerformanceOfGradeLeagueTraderMatchCriteria criteria)
        {
            var result = this._newDetailReportService.GetGradeLeagueTraderMatchBettypePerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult ExportGradePerformance(GetGradePerformanceCriteria criteria)
        {
            var templatePath = Server.MapPath(GradePerformanceDetail);
            var isViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);

            this._newDetailReportService.ExportGradePerformance(criteria, isViewScore, templatePath);

            return new EmptyResult();
        }

        #endregion Grade Performance

        #region Team Performance

        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult TeamPerformance()
        {
            ViewBag.Teams = this._newDetailReportService.GetTeams();

            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTeamPerformance(GetTeamPerformanceCriteria criteria)
        {
            var result = this._newDetailReportService.GetTeamPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfTeam(GetTraderPerformanceOfTeamCriteria criteria)
        {
            var result = this._newDetailReportService.GetTeamTraderPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfTeamTrader(GetMatchPerformanceOfTeamTraderCriteria criteria)
        {
            var result = _newDetailReportService.GetTeamTraderMatchPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult ExportTeamPerformance(GetTeamPerformanceCriteria criteria)
        {
            var templatePath = Server.MapPath(TeamPerformanceDetail);
            var isViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);

            this._newDetailReportService.ExportTeamPerformance(criteria, isViewScore, templatePath);

            return new EmptyResult();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetBettypeDetailTeam(GetBettypeDetailTeamCriteria criteria)
        {
            var result = this._newDetailReportService.GetTeamLeagueTraderMatchBettypePerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult GetLeagueDetailTeam(GetLeagueDetailTeamCriteria criteria)
        {
            var result = this._newDetailReportService.GetTeamLeaguePerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult GetTraderPerformanceOfLeagueTeam(GetTraderPerformanceOfLeagueTeam criteria)
        {
            var result = this._newDetailReportService.GetTeamLeagueTraderPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult GetMatchPerformanceOfTraderLeagueTeam(GetMatchPerformanceOfTraderLeagueTeamCriteria criteria)
        {
            var result = this._newDetailReportService.GetTeamLeagueTraderMatchPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
        #endregion Team Performance

        #region Bet Type Performance

        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult BetTypePerformance()
        {
            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetBetTypePerformance(GetBetTypePerformanceCriteria criteria)
        {
            var result = this._newDetailReportService.GetBetTypePerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfBetType(GetTraderPerformanceOfBetTypeCriteria criteria)
        {
            var result = this._newDetailReportService.GetBetTypeTraderPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfBetTypeTrader(GetMatchPerformanceOfBetTypeTraderCriteria criteria)
        {
            var result = this._newDetailReportService.GetBetTypeTraderMatchPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetLeaguePerformanceOfBetType(GetLeaguePerformanceOfBetTypeCriteria criteria)
        {
            var result = this._newDetailReportService.GetBetTypeLeaguePerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfBetTypeLeague(GetTraderPerformanceOfBetTypeLeagueCriteria criteria)
        {
            var result = this._newDetailReportService.GetBetTypeLeagueTraderPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfBetTypeLeagueTrader(GetMatchPerformanceOfBetTypeLeagueTraderCriteria criteria)
        {
            var result = this._newDetailReportService.GetBetTypeLeagueTraderMatchPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult ExportBetTypePerformance(GetBetTypePerformanceCriteria criteria)
        {
            var templatePath = Server.MapPath(BetTypePerformanceDetail);

            this._newDetailReportService.ExportBetTypePerformance(criteria, templatePath);

            return new EmptyResult();
        }

        #endregion Bet Type Performance

        #region Permission

        public ActionResult GetViewScorePermission()
        {
            var result = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        #endregion Permission
    }
}