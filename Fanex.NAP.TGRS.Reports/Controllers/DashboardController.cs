// --------------------------------------------------------------------------
// <copyright file="DashboardController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.12.08">Created</change>
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
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Services;
    using Fanex.NAP.TGRS.Reports.ViewModels.Dashboard;

    /// <summary>
    /// Performance summary report controller.
    /// </summary>
    public class DashboardController : TGRSBaseController
    {
        private readonly IDashboardService _dashboardService;

        [Simplect.Attribute.InjectObject]
        public DashboardController()
            : this(null)
        {
        }

        public DashboardController(IDashboardService dashboardService)
        {
            this._dashboardService = dashboardService ?? new DashboardService();
        }

        /// <summary>
        /// Gets Index page.
        /// </summary>
        /// <returns>Return Index View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Gets the summary data.
        /// </summary>
        /// <param name="month">The month.</param>
        /// <returns>
        /// JOSN result of action.
        /// </returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Need Review.")]
        public JsonResult GetSummaryData(int month)
        {
            GeneralInfo generalInfo = this._dashboardService.GetGeneralInfo(month).First();
            IEnumerable<League> bestLeagues = this._dashboardService.GetTopWinLeague(month);
            IEnumerable<TopTrader> bestTraders = this._dashboardService.GetTopTrader(month);
            IEnumerable<BetTypePerformance> bestBettypes = this._dashboardService.GetTopBettype(month);
            IEnumerable<MonthAmountItem> monthData = this._dashboardService.GetSummaryData(month);
            IEnumerable<TeamPerformance> teamData = this._dashboardService.GetTeamData(month);
            return Json(
                new
                {
                    GeneralInfo = generalInfo,
                    SummaryData = new
                    {
                        MonthData = monthData,
                        TeamData = teamData
                    },
                    BestLeagues = bestLeagues,
                    BestTraders = bestTraders,
                    BestBettypes = bestBettypes
                });
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public JsonResult GetTeamData(int month)
        {
            IEnumerable<TeamPerformance> teamData = this._dashboardService.GetTeamData(month);

            return Json(new
            {
                TeamData = teamData
            });
        }
    }
}