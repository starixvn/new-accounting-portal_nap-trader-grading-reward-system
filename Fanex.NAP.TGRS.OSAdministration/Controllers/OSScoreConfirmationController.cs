// --------------------------------------------------------------------------
// <copyright file="OSScoreConfirmationController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2016.8.26">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSConfiguration.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.OSAdministration.Criteria.ScoreConfirmation;
    using Fanex.NAP.TGRS.OSAdministration.Services.Implement;
    using Fanex.NAP.TGRS.OSAdministration.Services.Interface;
    using System;
    using System.Web.Mvc;

    public class OSScoreConfirmationController : TGRSBaseController
    {
        private const string TraderScoresExcelPath = @"~\Areas\OSAdministration\ExcelTemplates\TraderScores.xlsx";
        private readonly IScoreConfirmationService _scoreConfirmationService;

        public OSScoreConfirmationController(IScoreConfirmationService scoreConfirmationService)
        {
            this._scoreConfirmationService = scoreConfirmationService ?? new ScoreConfirmationService();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSScoreConfirmation, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            ViewBag.HasEditRight = this.HasRight(TGRSFunctionKeys.OSScoreConfirmation, Constant.Policy.Host);

            var lastestScoreHistory = _scoreConfirmationService.GetLastestScoreHistoryInfo(new GetLastedScoreHistoryInfoCriteria());
            DateTime minDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);
            minDate = minDate < AppSettings.AvailableDate ? AppSettings.AvailableDate : minDate;

            ViewBag.MinDate = minDate;
            ViewBag.DefaultFromDate = lastestScoreHistory.ToDate.AddDays(1);
            ViewBag.DefaultToDate = new DateTime(Math.Min(lastestScoreHistory.ToDate.AddDays(90).Ticks, DateTime.Today.Ticks));
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;

            return View(lastestScoreHistory);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSScoreConfirmation, Policy = Constant.Policy.Read)]
        [HttpGet]
        public JsonResult GetTraderScores(GetAllTraderScoreCriteria criteria)
        {
            var result = _scoreConfirmationService.GetTraderScores(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSScoreConfirmation, Policy = Constant.Policy.Host)]
        [HttpPost]
        public JsonResult StoreTraderConfirmedScores(StoreTraderConfirmedScoreCriteria criteria)
        {
            criteria.UserId = this.CurrentSession.UserId;
            var result = this._scoreConfirmationService.StoreTraderConfirmedScores(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSScoreConfirmation, Policy = Constant.Policy.Read)]
        public ActionResult ExportTraderScores(GetAllTraderScoreCriteria criteria)
        {
            var templatePath = Server.MapPath(TraderScoresExcelPath);

            _scoreConfirmationService.ExportTraderScores(criteria, templatePath);

            return new EmptyResult();
        }
    }
}