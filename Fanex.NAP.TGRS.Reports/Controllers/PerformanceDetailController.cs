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
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;

    /// <summary>
    /// Performance detail report controller.
    /// </summary>
    public class PerformanceDetailController : TGRSBaseController
    {
        public PerformanceDetailController()
        {
            ViewBag.MinDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);
            ViewBag.DefaultFromDate = DateTime.Today.AddDays(AppSettings.PerformanceDefaultDayRange * -1);
            ViewBag.DefaultToDate = DateTime.Today.AddDays(-1);
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;
        }

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
        /// Gets TraderPerformance page.
        /// </summary>
        /// <returns>Return TraderPerformance View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult TraderPerformance()
        {
            return View();
        }

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
        /// Gets TeamPerformance page.
        /// </summary>
        /// <returns>Return TeamPerformance View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult TeamPerformance()
        {
            return View();
        }

        /// <summary>
        /// Gets BetTypePerformance page.
        /// </summary>
        /// <returns>Return BetTypePerformance View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult BetTypePerformance()
        {
            return View();
        }
    }
}