// --------------------------------------------------------------------------
// <copyright file="PerformanceDetailController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.5.17">Created</change>
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

        private const string LeaguePerformanceDetail = @"~\Areas\Reports\ExcelTemplates\DetailReports\LeaguePerformance.xlsx";

        private readonly IDetailReportService _detailReportService;

        public PerformanceDetailController()
            : this(null)
        {
            ViewBag.MinDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);
            ViewBag.DefaultFromDate = DateTime.Today.AddDays(AppSettings.PerformanceDefaultDayRange * -1);
            ViewBag.DefaultToDate = DateTime.Today.AddDays(-1);
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;
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

            ////this._detailReportService.ExportLeaguePerformance(criteria, templateUrl);

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

        #endregion Grade Performance

        #region Team Performance

        /// <summary>
        /// Gets TeamPerformance page.
        /// </summary>
        /// <returns>Return TeamPerformance View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult TeamPerformance()
        {
            return View();
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