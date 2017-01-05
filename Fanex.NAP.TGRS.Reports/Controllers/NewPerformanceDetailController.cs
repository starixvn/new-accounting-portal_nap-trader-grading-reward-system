namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Services;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;
    using System;
    using System.Collections.Generic;
    using System.Web.Mvc;

    public class NewPerformanceDetailController : TGRSBaseController
    {
        #region Attributes and Constructors

        private const string LeaguePerformanceDetail = @"~\Areas\Reports\ExcelTemplates\NewDetailReports\LeaguePerformance.xls";
        private const string TraderPerformanceDetail = @"~\Areas\Reports\ExcelTemplates\NewDetailReports\TraderPerformance.xls";
        private const string GradePerformanceDetail = @"~\Areas\Reports\ExcelTemplates\NewDetailReports\GradePerformance.xls";
        private const string TeamPerformanceDetail = @"~\Areas\Reports\ExcelTemplates\NewDetailReports\TeamPerformance.xls";
        private const string BetTypePerformanceDetail = @"~\Areas\Reports\ExcelTemplates\NewDetailReports\BetTypePerformance.xls";

        private readonly IDetailReportService _detailReportService;

        private readonly int[] _forecastBetType = { 1, 3, 7, 8 };

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
            ViewBag.ForecastBetType = string.Join(",", this._forecastBetType);
        }

        public NewPerformanceDetailController(IDetailReportService detailReportService)
        {
            this._detailReportService = detailReportService ?? new DetailReportService();
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
            LeaguePerformanceList leaguePerformance = null;

            criteria.LeagueName = criteria.LeagueName ?? string.Empty;
            leaguePerformance = this._detailReportService.GetLeaguePerformance(criteria);
            JsonResult jsonResult = Json(leaguePerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult ExportLeaguePerformance(GetLeaguePerformanceCriteria criteria)
        {
            string templatePath = Server.MapPath(LeaguePerformanceDetail);

            this._detailReportService.ExportLeaguePerformance(criteria, templatePath);

            return new EmptyResult();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfLeague(GetTraderPerformanceOfLeagueCriteria criteria)
        {
            TraderPerformanceList traderPerformance = this._detailReportService.GetTraderPerformanceOfLeague(criteria);
            JsonResult jsonResult = Json(traderPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfLeagueTrader(GetMatchPerformanceOfLeagueTraderCriteria criteria)
        {
            MatchPerformanceGroup matchPerformance = this._detailReportService.GetMatchPerformanceOfLeagueTrader(criteria);
            JsonResult jsonResult = Json(matchPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetBettypeDetailLeague(GetBettypeDetailLeague criteria)
        {
            IEnumerable<BetTypeDetailItem> bettypeDetail = this._detailReportService.GetBettypeDetailLeague(criteria);
            JsonResult jsonResult = Json(bettypeDetail);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfLeague(GetMatchPerformanceOfLeagueCriteria criteria)
        {
            MatchPerformanceGroup matchPerformance = this._detailReportService.GetMatchPerformanceOfLeague(criteria);
            JsonResult jsonResult = Json(matchPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetBettypePerformanceOfLeagueMatch(GetBetTypePerformanceOfLeagueMatchCriteria criteria)
        {
            IEnumerable<BetTypeDetailItem> bettypePerformance = this._detailReportService.GetBettypePerformanceOfLeagueMatch(criteria);
            JsonResult jsonResult = Json(bettypePerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
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
            TraderPerformanceList traderPerformance = null;

            criteria.Username = criteria.Username ?? string.Empty;
            traderPerformance = this._detailReportService.GetTraderPerformance(criteria);
            JsonResult jsonResult = Json(traderPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetBettypeDetailTrader(GetBettypeDetailTrader criteria)
        {
            IEnumerable<BetTypeDetailItem> bettypeDetail = this._detailReportService.GetBettypeDetailTrader(criteria);
            JsonResult jsonResult = Json(bettypeDetail);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult ExportTraderPerformance(GetTraderPerformanceCriteria criteria)
        {
            string templatePath = Server.MapPath(TraderPerformanceDetail);

            this._detailReportService.ExportTraderPerformance(criteria, templatePath);

            return new EmptyResult();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfTrader(GetMatchPerformanceOfTraderCriteria criteria)
        {
            MatchPerformanceList martchPerformance = this._detailReportService.GetMatchPerformanceOfTrader(criteria);
            JsonResult jsonResult = Json(martchPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
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
            GradePerformanceList gradePerformance = this._detailReportService.GetGradePerformance(criteria);
            JsonResult jsonResult = Json(gradePerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfGrade(GetTraderPerformanceOfGradeCriteria criteria)
        {
            TraderPerformanceList traderPerformance = this._detailReportService.GetTraderPerformanceOfGrade(criteria);
            JsonResult jsonResult = Json(traderPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfGradeByLeague(GetTraderPerformanceOfGradeByLeagueCriteria criteria)
        {
            TraderPerformanceList traderPerformance = this._detailReportService.GetTraderPerformanceOfGradeByLeague(criteria);
            JsonResult jsonResult = Json(traderPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetLeaguePerformanceOfGrade(GetLeaguePerformanceOfGradeCriteria criteria)
        {
            LeaguePerformanceList leaguePerformance = this._detailReportService.GetLeaguePerformanceOfGrade(criteria);
            JsonResult jsonResult = Json(leaguePerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfGradeTrader(GetMatchPerformanceOfGradeTraderCriteria criteria)
        {
            MatchPerformanceList matchPerformance = this._detailReportService.GetMatchPerformanceOfGradeTrader(criteria);
            JsonResult jsonResult = Json(matchPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfGradeLeagueTrader(GetMatchPerformanceOfLeagueTraderCriteria criteria)
        {
            var matchPerformance = this._detailReportService.GetMatchPerformanceOfLeagueTrader(criteria);
            JsonResult jsonResult = Json(matchPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        /// <summary>
        /// Gets bet type detail from grade report.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the bet type detail.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetBettypeDetailGrade(GetBettypeDetailGrade criteria)
        {
            IEnumerable<BetTypeDetailItem> bettypeDetail = this._detailReportService.GetBettypeDetailGrade(criteria);
            JsonResult jsonResult = Json(bettypeDetail);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        /// <summary>
        /// Exports the grade performance.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>Excel file.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult ExportGradePerformance(GetGradePerformanceCriteria criteria)
        {
            string templatePath = Server.MapPath(GradePerformanceDetail);

            this._detailReportService.ExportGradePerformance(criteria, templatePath);

            return new EmptyResult();
        }

        #endregion Grade Performance

        #region Team Performance

        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult TeamPerformance()
        {
            IEnumerable<TeamItem> teams = this._detailReportService.GetTeams();
            ViewBag.Teams = teams;

            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTeamPerformance(GetTeamPerformanceCriteria criteria)
        {
            TeamPerformanceList teamPerformance = this._detailReportService.GetTeamPerformance(criteria);
            JsonResult jsonResult = Json(teamPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfTeam(GetTraderPerformanceOfTeamCriteria criteria)
        {
            TraderPerformanceList traderPerformance = this._detailReportService.GetTraderPerformanceOfTeam(criteria);
            JsonResult jsonResult = Json(traderPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfTeamTrader(GetMatchPerformanceOfTeamTraderCriteria criteria)
        {
            MatchPerformanceList matchPerformance = this._detailReportService.GetMatchPerformanceOfTeamTrader(criteria);
            JsonResult jsonResult = Json(matchPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetBettypeDetailTeam(GetBettypeDetailTeam criteria)
        {
            IEnumerable<BetTypeDetailItem> bettypeDetail = this._detailReportService.GetBettypeDetailTeam(criteria);
            JsonResult jsonResult = Json(bettypeDetail);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult ExportTeamPerformance(GetTeamPerformanceCriteria criteria)
        {
            string templatePath = Server.MapPath(TeamPerformanceDetail);

            _detailReportService.ExportTeamPerformance(criteria, templatePath);

            return new EmptyResult();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult GetLeagueDetailTeam(GetLeagueDetailTeamCriteria criteria)
        {
            return Json(_detailReportService.GetLeaguePerformance(criteria), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult GetTraderPerformanceOfLeagueTeam(GetTraderPerformanceOfLeagueTeam criteria)
        {
            return Json(_detailReportService.GetTraderPerformance(criteria), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult GetMatchPerformanceOfTraderLeagueTeam(GetMatchPerformanceOfTraderLeagueTeam criteria)
        {
            return Json(_detailReportService.GetMatchPerformanceOfTrader(criteria), JsonRequestBehavior.AllowGet);
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
            BetTypePerformanceList betTypePerformance = this._detailReportService.GetBetTypePerformance(criteria);
            JsonResult jsonResult = Json(betTypePerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfBetType(GetTraderPerformanceOfBetTypeCriteria criteria)
        {
            TraderPerformanceList traderPerformance = this._detailReportService.GetTraderPerformanceOfBetType(criteria);
            JsonResult jsonResult = Json(traderPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfBetTypeTrader(GetMatchPerformanceOfBetTypeTraderCriteria criteria)
        {
            MatchPerformanceList matchPerformance = this._detailReportService.GetMatchPerformanceOfBetTypeTrader(criteria);
            JsonResult jsonResult = Json(matchPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetLeaguePerformanceOfBetType(GetLeaguePerformanceOfBetTypeCriteria criteria)
        {
            LeaguePerformanceList leaguePerformance = this._detailReportService.GetLeaguePerformanceOfBetType(criteria);
            JsonResult jsonResult = Json(leaguePerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfBetTypeLeague(GetTraderPerformanceOfBetTypeLeagueCriteria criteria)
        {
            TraderPerformanceList traderPerformance = this._detailReportService.GetTraderPerformanceOfBetTypeLeague(criteria);
            JsonResult jsonResult = Json(traderPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfBetTypeLeagueTrader(GetMatchPerformanceOfBetTypeLeagueTraderCriteria criteria)
        {
            MatchPerformanceGroup matchPerformance = this._detailReportService.GetMatchPerformanceOfBetTypeLeagueTrader(criteria);
            JsonResult jsonResult = Json(matchPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult ExportBetTypePerformance(GetBetTypePerformanceCriteria criteria)
        {
            string templatePath = Server.MapPath(BetTypePerformanceDetail);

            this._detailReportService.ExportBetTypePerformance(criteria, templatePath);

            return new EmptyResult();
        }

        #endregion Bet Type Performance

        public ActionResult GetViewScorePermission()
        {
            var result = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}