namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using Core.Configurations;
    using Core.Helpers;
    using Criteria.ActualRatePerformanceDetail;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using NAP.Core.Business;
    using NAP.Core.Web.Attribute;
    using Services;
    using System;
    using System.Linq;
    using System.Web.Mvc;

    public class ActualRatePerformanceDetailController : TGRSBaseController
    {
        #region Attributes and Contructors
        private const string TraderPerformanceDetail = @"~\Areas\Reports\ExcelTemplates\ActualRateDetailReports\ActualRateTraderPerformance.xls";
        private readonly IActualRateDetailReportService _detailReportService;

        [Simplect.Attribute.InjectObject]
        public ActualRatePerformanceDetailController() : this(null)
        {
            DateTime minDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);

            minDate = minDate < AppSettings.AvailableDate ? AppSettings.AvailableDate : minDate;

            ViewBag.MinDate = minDate;
            ViewBag.DefaultFromDate = DateTime.Today.AddDays(AppSettings.PerformanceDefaultDayRange * -1);
            ViewBag.DefaultToDate = DateTime.Today;
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;
        }

        public ActualRatePerformanceDetailController(ActualRateTraderDetailReportService detailReportService)
        {
            this._detailReportService = detailReportService ?? new ActualRateTraderDetailReportService();
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
            return RedirectToAction("LeaguePerformance");
        }

        #endregion Index Page

        #region League Performance
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult LeaguePerformance()
        {
            return View();
        }

        #endregion League Performance

        #region Trader Performance
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public ActionResult TraderPerformance()
        {
            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformance(GetTraderPerformanceActualRateCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var traderPerformance = _detailReportService.GetTraderPerformance(criteria);
            
            return Json(traderPerformance, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderMatchPerformance(GetTraderMatchPerformanceActualRateCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var traderMatchPerformance = _detailReportService.GetTraderMatchPerformance(criteria);

            return Json(traderMatchPerformance.GroupBy(l => l.LeagueId), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderMatchBettypePerformance(GetTraderMatchBettypePerformanceActualRateCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            criteria.IsViewScore = HasRight(TGRSFunctionKeys.ScoreViewing, Constant.Policy.Read);
            var traderMatchBettypePerformance = _detailReportService.GetTraderMatchBettypePerformance(criteria);

            return Json(traderMatchBettypePerformance, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ExportTraderPerformance(GetTraderPerformanceActualRateCriteria criteria)
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
