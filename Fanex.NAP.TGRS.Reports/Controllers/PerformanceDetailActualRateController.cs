namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using Core.Configurations;
    using Core.Helpers;
    using Criteria.PerformanceDetailActualRate;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using NAP.Core.Business;
    using NAP.Core.Web.Attribute;
    using Services;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System.Web.Mvc;
    using ViewModels.PerformanceDetail;

    public class PerformanceDetailActualRateController : TGRSBaseController
    {
        #region Attributes and Contructors
        private const string TraderPerformanceDetail = @"~\Areas\Reports\ExcelTemplates\NewDetailReports\TraderPerformance.xls";
        private readonly IDetailActualRateReportService _detailReportService;

        [Simplect.Attribute.InjectObject]
        public PerformanceDetailActualRateController() : this(null)
        {
            DateTime minDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);

            minDate = minDate < AppSettings.AvailableDate ? AppSettings.AvailableDate : minDate;

            ViewBag.MinDate = minDate;
            ViewBag.DefaultFromDate = DateTime.Today.AddDays(AppSettings.PerformanceDefaultDayRange * -1);
            ViewBag.DefaultToDate = DateTime.Today;
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;
        }

        public PerformanceDetailActualRateController(DetailActualRateReportService detailReportService)
        {
            this._detailReportService = detailReportService ?? new DetailActualRateReportService();
        }

        #endregion Attributes and Contructors

        #region Index Page
        public ActionResult Index()
        {
            var permission = ReportUtil.GetBettypePermission(HasRight);
            if (permission == Models.Permission.BettypeViewPermission.None)
            {
                return Redirect("~/Error/AccessDenied");
            }
            return RedirectToAction("TraderPerformance");
        }

        #endregion Index Page

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
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var traderPerformance = _detailReportService.GetTraderPerformance(criteria);
            
            return Json(traderPerformance, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderMatchPerformance(GetTraderMatchPerformanceCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var traderMatchPerformance = _detailReportService.GetTraderMatchPerformance(criteria);

            return Json(traderMatchPerformance.GroupBy(l => l.LeagueId), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderMatchBettypePerformance(GetTraderMatchBettypePerformanceCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var traderMatchBettypePerformance = _detailReportService.GetTraderMatchBettypePerformance(criteria);

            return Json(traderMatchBettypePerformance, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ExportTraderPerformance(GetTraderPerformanceCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var templatePath = Server.MapPath(TraderPerformanceDetail);
            var isViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);

            this._detailReportService.ExportTraderPerformance(criteria, templatePath, isViewScore);

            return new EmptyResult();
        }
        #endregion Trader Performance

    }
}
