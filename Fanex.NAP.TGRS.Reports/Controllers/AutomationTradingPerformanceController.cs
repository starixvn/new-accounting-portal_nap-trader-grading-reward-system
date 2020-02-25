namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.Reports.Criteria.AutomationTradingPerformance;
    using Fanex.NAP.TGRS.Reports.Services;
    using System;    
    using System.Web.Mvc;
    
    public class AutomationTradingPerformanceController : TGRSBaseController
    {
        #region Attributes and Constructors
        private const string BetTypePerformanceDetail = @"~\Areas\Reports\ExcelTemplates\AutomationTradingPerformance\BetTypePerformance.xls";
        private const string MonthPerformanceDetail = @"~\Areas\Reports\ExcelTemplates\AutomationTradingPerformance\MonthPerformance.xls";
        private const string ModelPerformanceDetail = @"~\Areas\Reports\ExcelTemplates\AutomationTradingPerformance\ModelPerformance.xls";
        private readonly IAutomationTradingPerformanceService _automationTradingService;

        [Simplect.Attribute.InjectObject]
        public AutomationTradingPerformanceController() : this(null)
        {
            DateTime minDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);
            minDate = minDate < AppSettings.AvailableDate ? AppSettings.AvailableDate : minDate;

            ViewBag.MinDate = minDate;
            ViewBag.DefaultFromDate = DateTime.Today.AddDays(AppSettings.PerformanceDefaultDayRange * -1);
            ViewBag.DefaultToDate = DateTime.Today;
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;            
        }

        public AutomationTradingPerformanceController(IAutomationTradingPerformanceService automationTradingService)
        {
            this._automationTradingService = automationTradingService ?? new AutomationTradingPerformanceService();
            ViewBag.LeagueGroups = this._automationTradingService.GetLeagueGroups();
        }
        #endregion Attributes and Constructors

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View("BetTypePerformance");
        }

        #region BetType

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult BetTypePerformance()
        {
            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult GetBetTypePerformance(GetBetTypePerformanceCriteria criteria)
        {
            var bettypes = _automationTradingService.GetBetTypePerformance(criteria);

            var jsonResult = Json(bettypes);
            jsonResult.MaxJsonLength = int.MaxValue;
 
            return jsonResult;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult ExportBetTypePerformance(GetBetTypePerformanceCriteria criteria)
        {
            var templatePath = Server.MapPath(BetTypePerformanceDetail);

            _automationTradingService.ExportBetTypePerformance(CurrentSession.UserId, criteria, templatePath);

            return new EmptyResult();
        }

        #endregion

        #region Month

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult MonthPerformance()
        {
            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult GetMonthPerformance(GetMonthPerformanceCriteria criteria)
        {
            var months = _automationTradingService.GetMonthPerformance(criteria);

            var jsonResult = Json(months);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult ExportMonthPerformance(GetMonthPerformanceCriteria criteria)
        {
            var templatePath = Server.MapPath(MonthPerformanceDetail);
            _automationTradingService.ExportMonthPerformance(CurrentSession.UserId, criteria, templatePath);

            return new EmptyResult();
        }

        #endregion

        #region Model
        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult ModelPerformance()
        {
            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult GetModelPerformance(GetModelPerformanceCriteria criteria)
        {
            var models = _automationTradingService.GetModelPerformance(criteria);

            var jsonResult = Json(models);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult ExportModelPerformance(GetModelPerformanceCriteria criteria)
        {
            var templatePath = Server.MapPath(ModelPerformanceDetail);
            _automationTradingService.ExportModelPerformance(CurrentSession.UserId, criteria, templatePath);

            return new EmptyResult();
        }

        #endregion
    }
}