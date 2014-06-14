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
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Services.Implements;
    using Fanex.NAP.TGRS.Reports.Services.Interfaces;
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

        private readonly IDetailReportService _detailReportService;

        public PerformanceDetailController()
            : this(null)
        {
            DateTime minDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);
            IEnumerable<BetTypeItem> betTypes = this._detailReportService.GetBetTypes();

            minDate = minDate < AppSettings.AvailableDate ? AppSettings.AvailableDate : minDate;

            ViewBag.MinDate = minDate;
            ViewBag.DefaultFromDate = DateTime.Today.AddDays(AppSettings.PerformanceDefaultDayRange * -1);
            ViewBag.DefaultToDate = DateTime.Today.AddDays(-1);
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;
            ViewBag.BetTypes = betTypes;
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
        /// Gets LeaguePerformance page.
        /// </summary>
        /// <returns>Return LeaguePerformance View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult LeaguePerformance()
        {
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

            return Json(leaguePerformance);
        }

        /// <summary>
        /// Exports the league performance.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>Excel file.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult ExportLeaguePerformance(GetLeaguePerformanceCriteria criteria)
        {
            string templateUrl = Server.MapPath(LeaguePerformanceDetail);

            this._detailReportService.ExportLeaguePerformance(criteria, templateUrl);

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

            return Json(traderPerformance);
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

            return Json(matchPerformance);
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

            return Json(traderPerformance);
        }

        /// <summary>
        /// Exports the trader performance.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>Excel file.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult ExportTraderPerformance(GetTraderPerformanceCriteria criteria)
        {
            string templateUrl = Server.MapPath(TraderPerformanceDetail);

            this._detailReportService.ExportTraderPerformance(criteria, templateUrl);

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

            return Json(martchPerformance);
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

            return Json(gradePerformance);
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

            return Json(traderPerformance);
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

            return Json(matchPerformance);
        }

        /// <summary>
        /// Exports the grade performance.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>Excel file.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult ExportGradePerformance(GetGradePerformanceCriteria criteria)
        {
            string templateUrl = Server.MapPath(GradePerformanceDetail);

            this._detailReportService.ExportGradePerformance(criteria, templateUrl);

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

            return Json(teamPerformance);
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

            return Json(traderPerformance);
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

            return Json(matchPerformance);
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
            return View();
        }

        #endregion Bet Type Performance
    }
}