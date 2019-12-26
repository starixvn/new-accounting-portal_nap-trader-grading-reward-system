namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.Reports.Criteria.RT3PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Services;    
    using System;
    using System.Web.Mvc;
    
    public class RT3PerformanceDetailController : TGRSBaseController
    {
        #region Attributes and Constructors
        private const string BetTypePerformanceDetail = @"~\Areas\Reports\ExcelTemplates\RT3PerformanceDetail\BetTypePerformance.xls";
        private const string MonthPerformanceDetail = @"~\Areas\Reports\ExcelTemplates\RT3PerformanceDetail\MonthPerformance.xls";
        private readonly IRT3PerformanceDetailService _rt3PerformanceDetailService;

        [Simplect.Attribute.InjectObject]
        public RT3PerformanceDetailController() : this(null)
        {
            DateTime minDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);
            minDate = minDate < AppSettings.AvailableDate ? AppSettings.AvailableDate : minDate;

            ViewBag.MinDate = minDate;
            ViewBag.DefaultFromDate = DateTime.Today.AddDays(AppSettings.PerformanceDefaultDayRange * -1);
            ViewBag.DefaultToDate = DateTime.Today;
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;
        }

        public RT3PerformanceDetailController(IRT3PerformanceDetailService rt3PerformanceDetailService)
        {
            this._rt3PerformanceDetailService = rt3PerformanceDetailService ?? new RT3PerformanceDetailService();
        }
        #endregion Attributes and Constructors

        [NapAuth(FunctionKey = TGRSFunctionKeys.RT3PerformanceDetail, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View("BetTypePerformance");
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.RT3PerformanceDetail, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult BetTypePerformance()
        {
            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.RT3PerformanceDetail, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult GetBetTypePerformance(GetBetTypePerformanceCriteria criteria)
        {
            var bettypes = _rt3PerformanceDetailService.GetBetTypePerformance(criteria);
            var jsonResult = Json(bettypes);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.RT3PerformanceDetail, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult ExportBetTypePerformance(GetBetTypePerformanceCriteria criteria)
        {
            var templatePath = Server.MapPath(BetTypePerformanceDetail);
            _rt3PerformanceDetailService.ExportBetTypePerformance(CurrentSession.UserId, criteria, templatePath);

            return new EmptyResult();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.RT3PerformanceDetail, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult MonthPerformance()
        {
            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.RT3PerformanceDetail, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult GetMonthPerformance(GetMonthPerformanceCriteria criteria)
        {
            var bettypes = _rt3PerformanceDetailService.GetMonthPerformance(criteria);
            var jsonResult = Json(bettypes);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.RT3PerformanceDetail, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult ExportMonthPerformance(GetMonthPerformanceCriteria criteria)
        {
            var templatePath = Server.MapPath(MonthPerformanceDetail);
            _rt3PerformanceDetailService.ExportMonthPerformance(CurrentSession.UserId, criteria, templatePath);

            return new EmptyResult();
        }
    }
}