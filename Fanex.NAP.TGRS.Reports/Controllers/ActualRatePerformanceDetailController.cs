namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using Core.Configurations;
    using Core.Helpers;
    using Criteria.ActualRatePerformanceDetail;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using NAP.Core.Business;
    using NAP.Core.Web.Attribute;
    using Services;
    using System;
    using System.Linq;
    using System.Web.Mvc;

    public class ActualRatePerformanceDetailController : TGRSBaseController
    {
        #region Attributes and Contructors
        private const string LeaguePerformanceDetail = @"~\Areas\Reports\ExcelTemplates\ActualRateDetailReports\ActualRateLeaguePerformance.xls";
        private const string TraderPerformanceDetail = @"~\Areas\Reports\ExcelTemplates\ActualRateDetailReports\ActualRateTraderPerformance.xls";
        private const string GradePerformanceDetail = @"~\Areas\Reports\ExcelTemplates\ActualRateDetailReports\ActualRateGradePerformance.xls";
        private const string TeamPerformanceDetail = @"~\Areas\Reports\ExcelTemplates\ActualRateDetailReports\ActualRateTeamPerformance.xls";
        private const string BetTypePerformanceDetail = @"~\Areas\Reports\ExcelTemplates\ActualRateDetailReports\ActualRateBetTypePerformance.xls";

        private readonly IActualRateDetailReportService _detailReportService;

        [Simplect.Attribute.InjectObject]
        public ActualRatePerformanceDetailController() : this(null)
        {
            DateTime minDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);

            minDate = minDate < AppSettings.AvailableDate ? AppSettings.AvailableDate : minDate;

            ViewBag.MinDate = minDate;
            ViewBag.DefaultFromDate = DateTime.Today.AddDays(AppSettings.PerformanceDefaultDayRange * -1);
            ViewBag.DefaultToDate = DateTime.Today;
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;
        }

        public ActualRatePerformanceDetailController(ActualRateDetailReportService detailReportService)
        {
            this._detailReportService = detailReportService ?? new ActualRateDetailReportService();
        }

        #endregion Attributes and Contructors

        #region Index Page
        public ActionResult Index()
        {
            var permission = ReportUtil.GetBettypePermission(HasRight);
            if (permission == Models.Permission.BettypeViewPermission.None)
            {
                return Redirect("~/Error/AccessDenied");
            }
            return RedirectToAction("LeaguePerformance");
        }

        #endregion Index Page

        #region League Performance
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public ActionResult LeaguePerformance()
        {
            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetLeaguePerformance(GetActualRateLeaguePerformanceCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var result = this._detailReportService.GetLeaguePerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfLeague(GetActualRateTraderPerformanceOfLeagueCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var result = this._detailReportService.GetTraderPerformanceByLeague(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfLeague(GetActualRateMatchPerformanceOfLeagueCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var result = this._detailReportService.GetMatchPerformanceOfLeague(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfLeagueTrader(GetActualRateMatchPerformanceOfLeagueTraderCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var result = this._detailReportService.GetMatchPerformanceOfLeagueAndTrader(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetBettypeDetailLeague(GetActualRateBettypeDetailLeagueCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var result = this._detailReportService.GetBettypePerformanceOfLeagueTraderAndMatch(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetBettypePerformanceOfLeagueMatch(GetActualRateBetTypePerformanceOfLeagueMatchCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var result = this._detailReportService.GetBettypePerformanceOfLeagueAndMatch(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public ActionResult ExportLeaguePerformance(GetActualRateLeaguePerformanceCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            string templatePath = Server.MapPath(LeaguePerformanceDetail);
            this._detailReportService.ExportLeaguePerformance(criteria, templatePath);

            return new EmptyResult();
        }
        #endregion League Performance

        #region Trader Performance
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public ActionResult TraderPerformance()
        {
            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformance(GetActualRateTraderPerformanceCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var traderPerformance = _detailReportService.GetTraderPerformance(criteria);
            
            return Json(traderPerformance, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderMatchPerformance(GetActualRateTraderMatchPerformanceCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var traderMatchPerformance = _detailReportService.GetTraderMatchPerformance(criteria);

            return Json(traderMatchPerformance.GroupBy(l => l.LeagueId), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderMatchBettypePerformance(GetActualRateTraderMatchBettypePerformanceCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var traderMatchBettypePerformance = _detailReportService.GetTraderMatchBettypePerformance(criteria);

            return Json(traderMatchBettypePerformance, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ExportTraderPerformance(GetActualRateTraderPerformanceCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var templatePath = Server.MapPath(TraderPerformanceDetail);
            var isViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);

            this._detailReportService.ExportTraderPerformance(criteria, templatePath, isViewScore);

            return new EmptyResult();
        }
        #endregion Trader Performance

        #region Grade Performance
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public ActionResult GradePerformance()
        {
            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetGradePerformance(GetActualRateGradePerformanceCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var result = this._detailReportService.GetGradePerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfGrade(GetActualRateTraderPerformanceOfGradeCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var result = this._detailReportService.GetGradeTraderPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfGradeByLeague(GetActualRateTraderPerformanceOfGradeByLeagueCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var result = this._detailReportService.GetGradeLeagueTraderPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetLeaguePerformanceOfGrade(GetActualRateLeaguePerformanceOfGradeCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var result = this._detailReportService.GetGradeLeaguePerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfGradeTrader(GetActualRateMatchPerformanceOfGradeTraderCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var result = _detailReportService.GetGradeTraderMatchPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfGradeLeagueTrader(GetActualRateMatchPerformanceOfGradeLeagueTraderCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var result = this._detailReportService.GetGradeLeagueTraderMatchPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetBettypeDetailGrade(GetActualRateBetTypePerformanceOfGradeLeagueTraderMatchCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var result = this._detailReportService.GetGradeLeagueTraderMatchBettypePerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public ActionResult ExportGradePerformance(GetActualRateGradePerformanceCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var templatePath = Server.MapPath(GradePerformanceDetail);
            var isViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);

            this._detailReportService.ExportGradePerformance(criteria, isViewScore, templatePath);

            return new EmptyResult();
        }
        #endregion Grade Performance

        #region Team Performance
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public ActionResult TeamPerformance()
        {
            ViewBag.Teams = this._detailReportService.GetTeams();

            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetTeamPerformance(GetActualRateTeamPerformanceCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var result = this._detailReportService.GetTeamPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfTeam(GetActualRateTraderPerformanceOfTeamCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var result = this._detailReportService.GetTeamTraderPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfTeamTrader(GetActualRateMatchPerformanceOfTeamTraderCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var result = _detailReportService.GetTeamTraderMatchPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetBettypeDetailTeam(GetActualRateBettypeDetailTeamCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var result = this._detailReportService.GetTeamLeagueTraderMatchBettypePerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public ActionResult GetLeagueDetailTeam(GetActualRateLeagueDetailTeamCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var result = this._detailReportService.GetTeamLeaguePerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public ActionResult GetTraderPerformanceOfLeagueTeam(GetActualRateTraderPerformanceOfLeagueTeam criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var result = this._detailReportService.GetTeamLeagueTraderPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public ActionResult GetMatchPerformanceOfTraderLeagueTeam(GetActualRateMatchPerformanceOfTraderLeagueTeamCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var result = this._detailReportService.GetTeamLeagueTraderMatchPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public ActionResult ExportTeamPerformance(GetActualRateTeamPerformanceCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var templatePath = Server.MapPath(TeamPerformanceDetail);
            var isViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);

            this._detailReportService.ExportTeamPerformance(criteria, isViewScore, templatePath);

            return new EmptyResult();
        }
        #endregion Team Performance

        #region BetType Performance
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public ActionResult BetTypePerformance()
        {
            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetBetTypePerformance(GetActualRateBetTypePerformanceCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var result = this._detailReportService.GetBetTypePerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfBetType(GetActualRateTraderPerformanceOfBetTypeCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var result = this._detailReportService.GetBetTypeTraderPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfBetTypeTrader(GetActualRateMatchPerformanceOfBetTypeTraderCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var result = this._detailReportService.GetBetTypeTraderMatchPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetLeaguePerformanceOfBetType(GetActualRateLeaguePerformanceOfBetTypeCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var result = this._detailReportService.GetBetTypeLeaguePerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfBetTypeLeague(GetActualRateTraderPerformanceOfBetTypeLeagueCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var result = this._detailReportService.GetBetTypeLeagueTraderPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfBetTypeLeagueTrader(GetActualRateMatchPerformanceOfBetTypeLeagueTraderCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var result = this._detailReportService.GetBetTypeLeagueTraderMatchPerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
       
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetailActualRate, Policy = Constant.Policy.Read)]
        public ActionResult ExportBetTypePerformance(GetActualRateBetTypePerformanceCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var templatePath = Server.MapPath(BetTypePerformanceDetail);

            this._detailReportService.ExportBetTypePerformance(criteria, templatePath);

            return new EmptyResult();
        }
        #endregion BetType Performance
    }
}