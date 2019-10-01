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
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Services;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System.Web.Mvc;

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

        [Simplect.Attribute.InjectObject]
        public PerformanceDetailController()
            : this(null)
        {
            DateTime minDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);

            minDate = minDate < AppSettings.AvailableDate ? AppSettings.AvailableDate : minDate;

            ViewBag.MinDate = minDate;
            ViewBag.DefaultFromDate = DateTime.Today.AddDays(AppSettings.PerformanceDefaultDayRange * -1);
            ViewBag.DefaultToDate = DateTime.Today;
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;
            ViewBag.ForecastBetType = string.Join(",", this._forecastBetType);
        }

        public PerformanceDetailController(IDetailReportService detailReportService)
        {
            var service = new DetailReportService();
            service.PermissionCheck = HasRight;
            this._detailReportService = service;
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
            var permission = ReportUtil.GetBettypePermission(HasRight);

            if (permission == Models.Permission.BettypeViewPermission.None) return Redirect("~/Error/AccessDenied");

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
            IEnumerable<BetTypeItem> betTypes = this._detailReportService.GetBetTypesFromSession(CurrentSession.UserId);

            return Json(new
            {
                DefaultBettypes = from betType in betTypes where betType.IsDefaultCheck select betType.BetTypeId
            });
        }

        /// <summary>
        /// Gets LeaguePerformance page.
        /// </summary>
        /// <returns>Return LeaguePerformance View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult LeaguePerformance()
        {
            var permission = ReportUtil.GetBettypePermission(HasRight);

            IEnumerable<BetTypeItem> betTypes = this._detailReportService.GetBetTypes(CurrentSession.UserId, permission);

            ViewBag.BetTypes = betTypes;
            ViewBag.Markets = GetMarketsPermission();

            if (!AppSession.IsSoccerLivePermission && !AppSession.IsSoccerNoneLivePermission)
                return View("~/Areas/Reports/Views/PerformanceDetail/NoPermission.cshtml");

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

            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.LeagueName = criteria.LeagueName ?? string.Empty;
            leaguePerformance = this._detailReportService.GetLeaguePerformance(criteria, criteria.MarketFilter == Market.All);
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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            string templatePath = Server.MapPath(LeaguePerformanceDetail);

            this._detailReportService.ExportLeaguePerformance(CurrentSession.UserId, criteria, templatePath);

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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            IEnumerable<BetTypeDetailItem> bettypeDetail = this._detailReportService.GetBettypeDetailLeague(criteria);
            JsonResult jsonResult = Json(bettypeDetail);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        /// <summary>
        /// Gets the match performance of league.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the match performance of league data.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfLeague(GetMatchPerformanceOfLeagueCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            MatchPerformanceGroup matchPerformance = this._detailReportService.GetMatchPerformanceOfLeague(criteria);
            JsonResult jsonResult = Json(matchPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        /// <summary>
        /// Gets the bettype performance of pair a of league and match.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the match performance of league data.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetBettypePerformanceOfLeagueMatch(GetBetTypePerformanceOfLeagueMatchCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            IEnumerable<BetTypeDetailItem> bettypePerformance = this._detailReportService.GetBettypePerformanceOfLeagueMatch(criteria);
            JsonResult jsonResult = Json(bettypePerformance);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }

        private Dictionary<Market, string> GetMarketsPermission()
        {
            var markets = new Dictionary<Market, string>();

            if (AppSession.IsSoccerLivePermission && AppSession.IsSoccerNoneLivePermission)
            {
                markets.Add(Market.All, ViewLang.MarketAll);
                markets.Add(Market.Live, ViewLang.MarketLive);
                markets.Add(Market.NonLive, ViewLang.MarketNonLive);
            }
            else
            {
                if (AppSession.IsSoccerLivePermission)
                {
                    markets.Add(Market.Live, ViewLang.MarketLive);
                }

                if (AppSession.IsSoccerNoneLivePermission)
                {
                    markets.Add(Market.NonLive, ViewLang.MarketNonLive);
                }
            }

            return markets;
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
            var permission = ReportUtil.GetBettypePermission(HasRight);

            var betTypes = this._detailReportService.GetBetTypes(CurrentSession.UserId, permission);

            ViewBag.BetTypes = betTypes;
            ViewBag.Markets = GetMarketsPermission();

            if (!AppSession.IsSoccerLivePermission && !AppSession.IsSoccerNoneLivePermission)
                return View("~/Areas/Reports/Views/PerformanceDetail/NoPermission.cshtml");

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

            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var templatePath = Server.MapPath(TraderPerformanceDetail);
            var isViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);

            this._detailReportService.ExportTraderPerformance(CurrentSession.UserId, criteria, templatePath, isViewScore);

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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
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
            IEnumerable<BetTypeItem> betTypes = this._detailReportService.GetBetTypes(CurrentSession.UserId, ReportUtil.GetBettypePermission(HasRight));

            ViewBag.BetTypes = betTypes;
            ViewBag.Markets = GetMarketsPermission();

            if (!AppSession.IsSoccerLivePermission && !AppSession.IsSoccerNoneLivePermission)
                return View("~/Areas/Reports/Views/PerformanceDetail/NoPermission.cshtml");

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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            TraderPerformanceList traderPerformance = this._detailReportService.GetTraderPerformanceOfGrade(criteria);
            JsonResult jsonResult = Json(traderPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformanceOfGradeByLeague(GetTraderPerformanceOfGradeByLeagueCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            TraderPerformanceList traderPerformance = this._detailReportService.GetTraderPerformanceOfGradeByLeague(criteria);
            JsonResult jsonResult = Json(traderPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetLeaguePerformanceOfGrade(GetLeaguePerformanceOfGradeCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            LeaguePerformanceList leaguePerformance = this._detailReportService.GetLeaguePerformanceOfGrade(criteria);
            JsonResult jsonResult = Json(leaguePerformance);
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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            MatchPerformanceList matchPerformance = this._detailReportService.GetMatchPerformanceOfGradeTrader(criteria);
            JsonResult jsonResult = Json(matchPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfGradeLeagueTrader(GetMatchPerformanceOfLeagueTraderCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
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
        public JsonResult GetBettypeDetailGrade(GetBettypeDetailGradeCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var templatePath = Server.MapPath(GradePerformanceDetail);
            var isViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);

            this._detailReportService.ExportGradePerformance(CurrentSession.UserId, criteria, templatePath, isViewScore);

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
            var permission = ReportUtil.GetBettypePermission(HasRight);
            IEnumerable<BetTypeItem> betTypes = this._detailReportService.GetBetTypes(CurrentSession.UserId, permission);

            ViewBag.BetTypes = betTypes;
            ViewBag.Teams = teams;
            ViewBag.Markets = GetMarketsPermission();

            if (!AppSession.IsSoccerLivePermission && !AppSession.IsSoccerNoneLivePermission)
                return View("~/Areas/Reports/Views/PerformanceDetail/NoPermission.cshtml");

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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
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
        public JsonResult GetBettypeDetailTeam(GetBettypeDetailTeamCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var templatePath = Server.MapPath(TeamPerformanceDetail);
            var isViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);

            _detailReportService.ExportTeamPerformance(CurrentSession.UserId, criteria, templatePath, isViewScore);

            return new EmptyResult();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult GetLeagueDetailTeam(GetLeagueDetailTeamCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            return Json(_detailReportService.GetLeaguePerformance(criteria), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult GetTraderPerformanceOfLeagueTeam(GetTraderPerformanceOfLeagueTeam criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            return Json(_detailReportService.GetTraderPerformance(criteria), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult GetMatchPerformanceOfTraderLeagueTeam(GetMatchPerformanceOfTraderLeagueTeam criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            return Json(_detailReportService.GetMatchPerformanceOfTrader(criteria), JsonRequestBehavior.AllowGet);
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
            IEnumerable<BetTypeItem> betTypes = this._detailReportService.GetBetTypes(CurrentSession.UserId, ReportUtil.GetBettypePermission(HasRight));

            ViewBag.BetTypes = betTypes;
            ViewBag.Markets = GetMarketsPermission();

            if (!AppSession.IsSoccerLivePermission && !AppSession.IsSoccerNoneLivePermission)
                return View("~/Areas/Reports/Views/PerformanceDetail/NoPermission.cshtml");

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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            LeaguePerformanceList leaguePerformance = this._detailReportService.GetLeaguePerformanceOfBetType(criteria);
            JsonResult jsonResult = Json(leaguePerformance);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetBetChoicePerformanceOfBetType(GetBetChoicePerformanceOfBetTypeCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var result = this._detailReportService.GetBetTypeBetChoicePerformance(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            string templatePath = Server.MapPath(BetTypePerformanceDetail);

            this._detailReportService.ExportBetTypePerformance(CurrentSession.UserId, criteria, templatePath);

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