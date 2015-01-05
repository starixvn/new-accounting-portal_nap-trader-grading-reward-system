// --------------------------------------------------------------------------
// <copyright file="PerformanceDetailController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.5.17">Created</change>
//   <change who="Ken.Nguyen" date="2014.6.12">Add Excel export</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Services;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;

    /// <summary>
    /// Performance detail report controller.
    /// </summary>
    public class PerformanceDetailController : TGRSBaseController
    {
        #region Attributes and Constructors

        private const string LeaguePerformanceDetail = @"~\Areas\Reports\ExcelTemplates\DetailReports\LeaguePerformance.xls";
        private const string TraderPerformanceDetail = @"~\Areas\Reports\ExcelTemplates\DetailReports\TraderPerformance.xls";
        private const string GradePerformanceDetail = @"~\Areas\Reports\ExcelTemplates\DetailReports\GradePerformance.xls";
        private const string TeamPerformanceDetail = @"~\Areas\Reports\ExcelTemplates\DetailReports\TeamPerformance.xls";
        private const string BetTypePerformanceDetail = @"~\Areas\Reports\ExcelTemplates\DetailReports\BetTypePerformance.xls";

        private readonly IDetailReportService _detailReportService;

        private readonly int[] _forecastBetType = { 1, 3, 7, 8 };

        public PerformanceDetailController()
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

        public PerformanceDetailController(IDetailReportService detailReportService)
        {
            this._detailReportService = detailReportService ?? new DetailReportService();
        }

        #endregion Attributes and Constructors

        #region League Performance

        /// <summary>
        /// Gets Index page.
        /// </summary>
        /// <returns>Return Index View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return RedirectToAction("LeaguePerformance");
        }

        /// <summary>
        /// Gets initialized data for index page.
        /// </summary>
        /// <returns>List of JSON objects represents the team list and grade list.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Reviewed.")]
        public JsonResult GetDefaultBettypes()
        {
            IEnumerable<BetTypeItem> betTypes = this._detailReportService.GetBetTypesFromSession();

            return Json(new
            {
                DefaultBettypes = from betType in betTypes where betType.IsDefaultCheck == true select betType.BetTypeId
            });
        }

        /// <summary>
        /// Gets LeaguePerformance page.
        /// </summary>
        /// <returns>Return LeaguePerformance View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult LeaguePerformance()
        {
            IEnumerable<BetTypeItem> betTypes = this._detailReportService.GetBetTypes();

            ViewBag.BetTypes = betTypes;
            return View();
        }

        /// <summary>
        /// Gets the league performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the league performance data.</returns>
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

        /// <summary>
        /// Exports the league performance.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>Excel file.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult ExportLeaguePerformance(GetLeaguePerformanceCriteria criteria)
        {
            string templatePath = Server.MapPath(LeaguePerformanceDetail);

            this._detailReportService.ExportLeaguePerformance(criteria, templatePath);

            return new EmptyResult();
        }

        /// <summary>
        /// Gets the trader performance of a league.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the trader performance of a league data.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfLeague(GetTraderPerformanceOfLeagueCriteria criteria)
        {
            TraderPerformanceList traderPerformance = this._detailReportService.GetTraderPerformanceOfLeague(criteria);
            JsonResult jsonResult = Json(traderPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        /// <summary>
        /// Gets the match performance of a pair of league and trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the match performance of a pair of league and trader data.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfLeagueTrader(GetMatchPerformanceOfLeagueTraderCriteria criteria)
        {
            MatchPerformanceGroup matchPerformance = this._detailReportService.GetMatchPerformanceOfLeagueTrader(criteria);
            JsonResult jsonResult = Json(matchPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        /// <summary>
        /// Gets bet type detail from league report.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the bet type detail.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetBettypeDetailLeague(GetBettypeDetailLeague criteria)
        {
            IEnumerable<BetTypeDetailItem> bettypeDetail = this._detailReportService.GetBettypeDetailLeague(criteria);
            JsonResult jsonResult = Json(bettypeDetail);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        #endregion League Performance

        #region Trader Performance

        /// <summary>
        /// Gets TraderPerformance page.
        /// </summary>
        /// <returns>Return TraderPerformance View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult TraderPerformance()
        {
            IEnumerable<BetTypeItem> betTypes = this._detailReportService.GetBetTypes();

            ViewBag.BetTypes = betTypes;

            return View();
        }

        /// <summary>
        /// Gets the trader performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the trader performance data.</returns>
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

        /// <summary>
        /// Gets bet type detail from trader report.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the bet type detail.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetBettypeDetailTrader(GetBettypeDetailTrader criteria)
        {
            IEnumerable<BetTypeDetailItem> bettypeDetail = this._detailReportService.GetBettypeDetailTrader(criteria);
            JsonResult jsonResult = Json(bettypeDetail);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        /// <summary>
        /// Exports the trader performance.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>Excel file.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult ExportTraderPerformance(GetTraderPerformanceCriteria criteria)
        {
            string templatePath = Server.MapPath(TraderPerformanceDetail);

            this._detailReportService.ExportTraderPerformance(criteria, templatePath);

            return new EmptyResult();
        }

        /// <summary>
        /// Gets the match performance of a trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the match performance of a trader data.</returns>
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

        /// <summary>
        /// Gets GradePerformance page.
        /// </summary>
        /// <returns>Return GradePerformance View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult GradePerformance()
        {
            IEnumerable<BetTypeItem> betTypes = this._detailReportService.GetBetTypes();

            ViewBag.BetTypes = betTypes;

            return View();
        }

        /// <summary>
        /// Gets the grade performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the grade performance data.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetGradePerformance(GetGradePerformanceCriteria criteria)
        {
            GradePerformanceList gradePerformance = this._detailReportService.GetGradePerformance(criteria);
            JsonResult jsonResult = Json(gradePerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        /// <summary>
        /// Gets the trader performance of a grade.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the trader performance of a grade data.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfGrade(GetTraderPerformanceOfGradeCriteria criteria)
        {
            TraderPerformanceList traderPerformance = this._detailReportService.GetTraderPerformanceOfGrade(criteria);
            JsonResult jsonResult = Json(traderPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        /// <summary>
        /// Gets the match performance of a pair of grade and trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the match performance of a pair of grade and trader data.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfGradeTrader(GetMatchPerformanceOfGradeTraderCriteria criteria)
        {
            MatchPerformanceList matchPerformance = this._detailReportService.GetMatchPerformanceOfGradeTrader(criteria);
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

        /// <summary>
        /// Gets TeamPerformance page.
        /// </summary>
        /// <returns>Return TeamPerformance View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult TeamPerformance()
        {
            IEnumerable<TeamItem> teams = this._detailReportService.GetTeams();
            IEnumerable<BetTypeItem> betTypes = this._detailReportService.GetBetTypes();

            ViewBag.BetTypes = betTypes;
            ViewBag.Teams = teams;

            return View();
        }

        /// <summary>
        /// Gets the team performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the team performance data.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTeamPerformance(GetTeamPerformanceCriteria criteria)
        {
            TeamPerformanceList teamPerformance = this._detailReportService.GetTeamPerformance(criteria);
            JsonResult jsonResult = Json(teamPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        /// <summary>
        /// Gets the trader performance of a team.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the trader performance of a team data.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfTeam(GetTraderPerformanceOfTeamCriteria criteria)
        {
            TraderPerformanceList traderPerformance = this._detailReportService.GetTraderPerformanceOfTeam(criteria);
            JsonResult jsonResult = Json(traderPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        /// <summary>
        /// Gets the match performance of a pair of team and trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the match performance of a pair of team and trader data.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfTeamTrader(GetMatchPerformanceOfTeamTraderCriteria criteria)
        {
            MatchPerformanceList matchPerformance = this._detailReportService.GetMatchPerformanceOfTeamTrader(criteria);
            JsonResult jsonResult = Json(matchPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        /// <summary>
        /// Gets bet type detail from team report.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the bet type detail.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetBettypeDetailTeam(GetBettypeDetailTeam criteria)
        {
            IEnumerable<BetTypeDetailItem> bettypeDetail = this._detailReportService.GetBettypeDetailTeam(criteria);
            JsonResult jsonResult = Json(bettypeDetail);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        /// <summary>
        /// Exports the team performance.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>Excel file.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult ExportTeamPerformance(GetTeamPerformanceCriteria criteria)
        {
            string templatePath = Server.MapPath(TeamPerformanceDetail);

            this._detailReportService.ExportTeamPerformance(criteria, templatePath);

            return new EmptyResult();
        }

        #endregion Team Performance

        #region Bet Type Performance

        /// <summary>
        /// Gets BetTypePerformance page.
        /// </summary>
        /// <returns>Return BetTypePerformance View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult BetTypePerformance()
        {
            IEnumerable<BetTypeItem> betTypes = this._detailReportService.GetBetTypes();

            ViewBag.BetTypes = betTypes;

            return View();
        }

        /// <summary>
        /// Gets the bet type performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the bet type performance data.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetBetTypePerformance(GetBetTypePerformanceCriteria criteria)
        {
            BetTypePerformanceList betTypePerformance = this._detailReportService.GetBetTypePerformance(criteria);
            JsonResult jsonResult = Json(betTypePerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        /// <summary>
        /// Gets the trader performance of a bet type.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the trader performance of a bet type data.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfBetType(GetTraderPerformanceOfBetTypeCriteria criteria)
        {
            TraderPerformanceList traderPerformance = this._detailReportService.GetTraderPerformanceOfBetType(criteria);
            JsonResult jsonResult = Json(traderPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        /// <summary>
        /// Gets the match performance of a pair of bet type and trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the match performance of a pair of bet type and trader data.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfBetTypeTrader(GetMatchPerformanceOfBetTypeTraderCriteria criteria)
        {
            MatchPerformanceList matchPerformance = this._detailReportService.GetMatchPerformanceOfBetTypeTrader(criteria);
            JsonResult jsonResult = Json(matchPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        /// <summary>
        /// Gets the league performance of bet type.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the league performance of bet type.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetLeaguePerformanceOfBetType(GetLeaguePerformanceOfBetTypeCriteria criteria)
        {
            LeaguePerformanceList leaguePerformance = this._detailReportService.GetLeaguePerformanceOfBetType(criteria);
            JsonResult jsonResult = Json(leaguePerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        /// <summary>
        /// Gets the trader performance of a pair of bet type and league.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the trader performance of bet type and league.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfBetTypeLeague(GetTraderPerformanceOfBetTypeLeagueCriteria criteria)
        {
            TraderPerformanceList traderPerformance = this._detailReportService.GetTraderPerformanceOfBetTypeLeague(criteria);
            JsonResult jsonResult = Json(traderPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        /// <summary>
        /// Gets the match performance of bet type, league and trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the match performance of bet type, league and trader.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfBetTypeLeagueTrader(GetMatchPerformanceOfBetTypeLeagueTraderCriteria criteria)
        {
            MatchPerformanceGroup matchPerformance = this._detailReportService.GetMatchPerformanceOfBetTypeLeagueTrader(criteria);
            JsonResult jsonResult = Json(matchPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        /// <summary>
        /// Exports the bet type performance.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>Excel file.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult ExportBetTypePerformance(GetBetTypePerformanceCriteria criteria)
        {
            string templatePath = Server.MapPath(BetTypePerformanceDetail);

            this._detailReportService.ExportBetTypePerformance(criteria, templatePath);

            return new EmptyResult();
        }

        #endregion Bet Type Performance
    }
}