// -----------------------------------------------------------------------
// <copyright file="OSSportPerformanceController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Aaron" date="2016.08.10">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSReports.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.OSReports.Services.SportPerformance;
    using System;
    using System.Web.Mvc;

    public class OSSportPerformanceController : TGRSBaseController
    {
        private readonly ISportPerformanceService _sportPerformanceService;

        public OSSportPerformanceController()
        {
            _sportPerformanceService = new SportPerformanceService();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSSportPerformance, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            DateTime minDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);
            minDate = minDate < AppSettings.AvailableDate ? AppSettings.AvailableDate : minDate;

            ViewBag.MinDate = minDate;
            ViewBag.DefaultFromDate = DateTime.Today.AddDays(AppSettings.PerformanceDefaultDayRange * -1);
            ViewBag.DefaultToDate = DateTime.Today.AddDays(-1);
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;

            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSSportPerformance, Policy = Constant.Policy.Read)]
        public ActionResult GetAllSports()
        {
            var sports = _sportPerformanceService.GetAllSport();

            return Json(sports, JsonRequestBehavior.AllowGet);
        }
    }
}