// --------------------------------------------------------------------------
// <copyright file="PerformanceSummaryController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.19">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Services;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceSummary;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;

    /// <summary>
    /// Performance summary report controller.
    /// </summary>
    public class PerformanceSummaryController : TGRSBaseController
    {
        private readonly ISummaryReportService _summaryReportService;

        [Simplect.Attribute.InjectObject]
        public PerformanceSummaryController()
            : this(null)
        {
        }

        public PerformanceSummaryController(ISummaryReportService summaryReportService)
        {
            this._summaryReportService = summaryReportService ?? new SummaryReportService();
        }

        /// <summary>
        /// Gets Index page.
        /// </summary>
        /// <returns>Return Index View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            var permission = ReportUtil.GetBettypeViewPermission(HasRight, TGRSFunctionKeys.PerformanceSummary_PHbettypes, TGRSFunctionKeys.PerformanceSummary_Majorbettypes);

            if (permission == Models.Permission.BettypeViewPermission.None) return Redirect("~/Error/AccessDenied");

            DateTime minDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);
            minDate = minDate < AppSettings.AvailableDate ? AppSettings.AvailableDate : minDate;

            ViewBag.MinDate = minDate;
            ViewBag.DefaultFromDate = DateTime.Today.AddDays(AppSettings.PerformanceDefaultDayRange * -1);
            ViewBag.DefaultToDate = DateTime.Today.AddDays(-1);
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;

            return View();
        }

        /// <summary>
        /// Gets TraderRank page.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>TraderRank view.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public ActionResult TraderRank(GetTopTraderCriteria criteria)
        {
            return View(criteria);
        }

        /// <summary>
        /// Get performance summary reports.
        /// </summary>
        /// <param name="filter">Filter model of performance summary reports.</param>
        /// <returns>List of JSON objects.</returns>
        public JsonResult GetReports(ReportFilter filter)
        {
            var permission = (int)ReportUtil.GetBettypeViewPermission(HasRight, TGRSFunctionKeys.PerformanceSummary_PHbettypes, TGRSFunctionKeys.PerformanceSummary_Majorbettypes);

            var generalCriteria = new GetGeneralInfoCriteria
            {
                ReportType = filter.ReportType,
                FromDate = filter.FromDate,
                ToDate = filter.ToDate,
                ViewPermission = permission
            };
            GeneralInfo generalInfo = this._summaryReportService.GetGeneralInfo(generalCriteria).First();

            var teamCriteria = new GetTeamPerformanceCriteria
            {
                ReportType = filter.ReportType,
                FromDate = filter.FromDate,
                ToDate = filter.ToDate,
                ViewPermission = permission
            };
            IEnumerable<TeamPerformance> teamResult = this._summaryReportService.GetTeamPerformance(teamCriteria);

            var traderCriteria = new GetTraderPerformanceCriteria
            {
                ReportType = filter.ReportType,
                FromDate = filter.FromDate,
                ToDate = filter.ToDate,
                ViewPermission = permission
            };
            TraderPerformance traderResult = this._summaryReportService.GetTraderPerformance(traderCriteria).First();

            var betTypeCriteria = new GetBetTypePerformanceCriteria() { ReportType = filter.ReportType, FromDate = filter.FromDate, ToDate = filter.ToDate };
            IEnumerable<BetTypePerformance> betTypeResult = this._summaryReportService.GetBetTypePerformance(betTypeCriteria);

            var winLeagueCriteria = new GetTopWinLeagueCriteria() { ReportType = filter.ReportType, FromDate = filter.FromDate, ToDate = filter.ToDate };
            IEnumerable<League> winLeagueResult = this._summaryReportService.GetTopWinLeague(winLeagueCriteria);

            var loseLeagueCriteria = new GetTopLoseLeagueCriteria() { ReportType = filter.ReportType, FromDate = filter.FromDate, ToDate = filter.ToDate };
            IEnumerable<League> loseLeagueResult = this._summaryReportService.GetTopLoseLeague(loseLeagueCriteria);

            Reports reports = new Reports()
            {
                GeneralInfo = generalInfo,
                TeamPerformances = teamResult,
                TraderPerformance = traderResult,
                BetTypePerformances = betTypeResult,
                WinLeagues = winLeagueResult,
                LoseLeagues = loseLeagueResult
            };

            return Json(reports);
        }

        /// <summary>
        /// Get top, bottom trader by performance.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>List of JSON objects.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderRankData(GetTopTraderCriteria criteria)
        {
            IEnumerable<TopTrader> result = this._summaryReportService.GetTopTrader(criteria);

            return Json(result);
        }
    }
}