namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Criteria.RTModelPerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Services;
    using Fanex.NAP.TGRS.Reports.ViewModels.RTModelPerformanceDetail;
    using System;    
    using System.Web.Mvc;
    
    public class RTModelPerformanceDetailController : TGRSBaseController
    {
        #region Attributes and Constructors
        private const string BetTypePerformanceDetail = @"~\Areas\Reports\ExcelTemplates\RTModelPerformanceDetail\BetTypePerformance.xls";
        private const string MonthPerformanceDetail = @"~\Areas\Reports\ExcelTemplates\RTModelPerformanceDetail\MonthPerformance.xls";
        private const string ModelPerformanceDetail = @"~\Areas\Reports\ExcelTemplates\RTModelPerformanceDetail\ModelPerformance.xls";
        private readonly IRTModelPerformanceDetailService _rtModelService;

        [Simplect.Attribute.InjectObject]
        public RTModelPerformanceDetailController() : this(null)
        {
            DateTime minDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);
            minDate = minDate < AppSettings.AvailableDate ? AppSettings.AvailableDate : minDate;

            ViewBag.MinDate = minDate;
            ViewBag.DefaultFromDate = DateTime.Today.AddDays(AppSettings.PerformanceDefaultDayRange * -1);
            ViewBag.DefaultToDate = DateTime.Today;
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;            
        }

        public RTModelPerformanceDetailController(IRTModelPerformanceDetailService rt3PerformanceDetailService)
        {
            this._rtModelService = rt3PerformanceDetailService ?? new RT3PerformanceDetailService();
            ViewBag.LeagueGroups = this._rtModelService.GetLeagueGroups();
        }
        #endregion Attributes and Constructors

        [NapAuth(FunctionKey = TGRSFunctionKeys.RobotTradingModelsPerformanceDetail, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View("BetTypePerformance");
        }

        #region BetType

        [NapAuth(FunctionKey = TGRSFunctionKeys.RobotTradingModelsPerformanceDetail, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult BetTypePerformance()
        {
            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.RobotTradingModelsPerformanceDetail, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult GetBetTypePerformance(GetBetTypePerformanceCriteria criteria)
        {
            var bettypes = _rtModelService.GetBetTypePerformance(criteria);

            var jsonResult = Json(bettypes);
            jsonResult.MaxJsonLength = int.MaxValue;
 
            return jsonResult;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.RobotTradingModelsPerformanceDetail, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult ExportBetTypePerformance(GetBetTypePerformanceCriteria criteria)
        {
            //var templatePath = Server.MapPath(BetTypePerformanceDetail);
            //var fileName = string.Format(
            //                    ViewLang.RTModelPerformanceDetailFileName,
            //                    ViewLang.Month,
            //                    criteria.FromDate.ToShortFormatedDateForFileName(),
            //                    criteria.ToDate.ToShortFormatedDateForFileName()) + ".xlsx";

            //var file = _rtModelService.ExportBetTypePerformance(CurrentSession.UserId, criteria, templatePath);

            //return File(file, "application/vnd.ms-excel", fileName);

            var templatePath = Server.MapPath(BetTypePerformanceDetail);

            _rtModelService.ExportBetTypePerformance(CurrentSession.UserId, criteria, templatePath);

            return new EmptyResult();
        }

        #endregion

        #region Month

        [NapAuth(FunctionKey = TGRSFunctionKeys.RobotTradingModelsPerformanceDetail, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult MonthPerformance()
        {
            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.RobotTradingModelsPerformanceDetail, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult GetMonthPerformance(GetMonthPerformanceCriteria criteria)
        {
            var months = criteria.LeagueGroupIds != null
                ? _rtModelService.GetMonthPerformance(criteria)
                : new MonthPerformanceList();

            var jsonResult = Json(months);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.RobotTradingModelsPerformanceDetail, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult ExportMonthPerformance(GetMonthPerformanceCriteria criteria)
        {
            var templatePath = Server.MapPath(MonthPerformanceDetail);
            _rtModelService.ExportMonthPerformance(CurrentSession.UserId, criteria, templatePath);

            return new EmptyResult();
        }

        #endregion

        #region Model
        [NapAuth(FunctionKey = TGRSFunctionKeys.RobotTradingModelsPerformanceDetail, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult ModelPerformance()
        {
            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.RobotTradingModelsPerformanceDetail, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult GetModelPerformance(GetModelPerformanceCriteria criteria)
        {
            var models = _rtModelService.GetModelPerformance(criteria);

            var jsonResult = Json(models);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.RobotTradingModelsPerformanceDetail, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult ExportModelPerformance(GetModelPerformanceCriteria criteria)
        {
            var templatePath = Server.MapPath(ModelPerformanceDetail);
            _rtModelService.ExportModelPerformance(CurrentSession.UserId, criteria, templatePath);

            return new EmptyResult();
        }

        #endregion
    }
}