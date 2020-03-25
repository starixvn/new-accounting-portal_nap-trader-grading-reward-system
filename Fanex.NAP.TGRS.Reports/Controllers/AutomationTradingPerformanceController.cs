namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.Core.Consts;
    using Fanex.NAP.TGRS.Reports.Criteria.AutomationTradingPerformance;
    using Fanex.NAP.TGRS.Reports.Services;
    using System;    
    using System.Web.Mvc;
    
    public class AutomationTradingPerformanceController : TGRSBaseController
    {
        #region Attributes and Constructors
        private const string FileBetTypePerformance = @"~\Areas\Reports\ExcelTemplates\AutomationTradingPerformance\BetTypePerformance.xls";
        private const string FilePeriodPerformance = @"~\Areas\Reports\ExcelTemplates\AutomationTradingPerformance\PeriodPerformance.xls";
        private const string FileEventPerformance = @"~\Areas\Reports\ExcelTemplates\AutomationTradingPerformance\EventPerformance.xls";
        private const string FileEventLeaguePerformance = @"~\Areas\Reports\ExcelTemplates\AutomationTradingPerformance\EventLeaguePerformance.xls";
        private const string FileLeaguePerformance = @"~\Areas\Reports\ExcelTemplates\AutomationTradingPerformance\LeaguePerformance.xls";
        private const string FileMatchPerformanceOfEventLeague = @"~\Areas\Reports\ExcelTemplates\AutomationTradingPerformance\MatchPerformanceOfEventLeague.xls";
        private const string FileModelPerformance = @"~\Areas\Reports\ExcelTemplates\AutomationTradingPerformance\ModelPerformance.xls";
        private readonly IAutomationTradingReportService _automationTradingService;

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

        public AutomationTradingPerformanceController(IAutomationTradingReportService automationTradingService)
        {
            this._automationTradingService = automationTradingService ?? new AutomationTradingReportService();
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
            var bettypes = _automationTradingService.GetAutoTradingBetTypePerformance(criteria);

            var jsonResult = Json(bettypes);
            jsonResult.MaxJsonLength = int.MaxValue;
 
            return jsonResult;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult ExportBetTypePerformance(GetBetTypePerformanceCriteria criteria)
        {
            var templatePath = Server.MapPath(FileBetTypePerformance);

            _automationTradingService.ExportAutoTradingBetTypePerformance(CurrentSession.UserId, criteria, templatePath);

            return new EmptyResult();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult GetLeaguePerformanceOfBetType(GetLeaguePerformanceOfBetTypeCriteria criteria)
        {
            var leagueList = _automationTradingService.GetAutoTradingLeaguePerformanceOfBetType(criteria);

            var jsonResult = Json(leagueList);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult ExportLeaguePerformanceOfBetType(GetLeaguePerformanceOfBetTypeCriteria criteria, string conditionKey)
        {
            var templatePath = Server.MapPath(FileLeaguePerformance);

            criteria.LeagueIdList = _automationTradingService.GetLeagueIdListFromSession(conditionKey, Consts.AutomationTradingBetTypeListSessionKey);

            _automationTradingService.ExportAutoTradingLeaguePerformanceOfBetType(CurrentSession.UserId, criteria, templatePath);

            return new EmptyResult();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult GetMatchPerformanceOfBetTypeLeague(GetMatchPerformanceOfBetTypeLeagueCriteria criteria)
        {
            var matchList = _automationTradingService.GetAutoTradingMatchPerformanceOfBetTypeLeague(criteria);

            var jsonResult = Json(matchList);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult ExportMatchPerformanceOfBetTypeLeague(GetMatchPerformanceOfBetTypeLeagueCriteria criteria, string conditionKey)
        {
            var templatePath = Server.MapPath(FileMatchPerformance);

            criteria.MatchIdList = _automationTradingService.GetLeagueIdListFromSession(conditionKey, Consts.AutomationTradingLeaguePerformanceOfBetTypeSessionKey);

            _automationTradingService.ExportAutoTradingMatchPerformanceOfBetTypeLeague(CurrentSession.UserId, criteria, templatePath);

            return new EmptyResult();
        }

        #endregion

        #region Period

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult PeriodPerformance()
        {
            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult GetWeekPerformance(GetWeekPerformanceCriteria criteria)
        {         
            var months = _automationTradingService.GetAutoTradingWeekPerformance(criteria);

            var jsonResult = Json(months);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult GetMonthPerformance(GetMonthPerformanceCriteria criteria)
        {
            var months = _automationTradingService.GetAutoTradingMonthPerformance(criteria);

            var jsonResult = Json(months);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }       

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult ExportPeriodPerformance(GetMonthPerformanceCriteria criteria)
        {         
            var templatePath = Server.MapPath(FilePeriodPerformance);
            _automationTradingService.ExportAutoTradingPeriodPerformance(CurrentSession.UserId, criteria, templatePath);

            return new EmptyResult();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult GetLeaguePerformanceOfPeriod(GetLeaguePerformanceOfPeriodCriteria criteria)
        {           
            var leagueList = _automationTradingService.GetAutoTradingLeaguePerformanceOfPeriod(criteria);

            var jsonResult = Json(leagueList);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult ExportLeaguePerformanceOfPeriod(GetLeaguePerformanceOfPeriodCriteria criteria, string conditionKey)
        {
            var templatePath = Server.MapPath(FileLeaguePerformance);

            criteria.LeagueIdList = _automationTradingService.GetLeagueIdListFromSession(conditionKey, Consts.AutomationTradingPeriodPerformanceSessionKey);

            _automationTradingService.ExportAutoTradingLeaguePerformanceOfPeriod(CurrentSession.UserId, criteria, templatePath);

            return new EmptyResult();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult GetMatchPerformanceOfPeriodLeague(GetMatchPerformanceOfPeriodLeagueCriteria criteria)
        {
            var matchList = _automationTradingService.GetAutoTradingMatchPerformanceOfPeriodLeague(criteria);

            var jsonResult = Json(matchList);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult ExportMatchPerformanceOfPeriodLeague(GetMatchPerformanceOfPeriodLeagueCriteria criteria, string conditionKey)
        {
            var templatePath = Server.MapPath(FileMatchPerformance);

            criteria.MatchIdList = _automationTradingService.GetLeagueIdListFromSession(conditionKey, Consts.AutomationTradingLeaguePerformanceOfPeriodSessionKey);

            _automationTradingService.ExportAutoTradingMatchPerformanceOfPeriodLeague(CurrentSession.UserId, criteria, templatePath);

            return new EmptyResult();
        }

        #endregion

        #region Event
        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult EventPerformance()
        {
            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult GetEventPerformance(GetEventPerformanceCriteria criteria)
        {
            var eventList = _automationTradingService.GetAutoTradingEventPerformance(criteria);

            var jsonResult = Json(eventList);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }       

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult ExportEventPerformance(GetEventPerformanceCriteria criteria)
        {
            var templatePath = Server.MapPath(FileEventPerformance);

            _automationTradingService.ExportAutoTradingEventPerformance(CurrentSession.UserId, criteria, templatePath);

            return new EmptyResult();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult GetLeaguePerformanceOfEvent(GetLeaguePerformanceOfEventCriteria criteria)
        {
            var leagueList = _automationTradingService.GetAutoTradingLeaguePerformanceOfEvent(criteria);

            var jsonResult = Json(leagueList);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]        
        public ActionResult ExportLeaguePerformanceOfEvent(GetLeaguePerformanceOfEventCriteria criteria, string conditionKey)
        {
            var templatePath = Server.MapPath(FileLeaguePerformance);

            criteria.LeagueIdList = _automationTradingService.GetLeagueIdListFromSession(conditionKey, Consts.AutomationTradingEventPerformanceSessionKey);

            _automationTradingService.ExportAutoTradingLeaguePerformanceOfEvent(CurrentSession.UserId, criteria, templatePath);

            return new EmptyResult();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult ExportEventLeaguePerformance(GetLeaguePerformanceOfEventCriteria criteria)
        {
            criteria.IsExportEventLeague = true;

            var templatePath = Server.MapPath(FileEventLeaguePerformance);

            var eventLeagueList = _automationTradingService.GetAutoTradingEventLeaguePerformance(criteria);

            _automationTradingService.ExportAutoTradingEventLeaguePerformance(eventLeagueList, CurrentSession.UserId, criteria, templatePath);

            return new EmptyResult();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult GetMatchPerformanceOfEventLeague(GetMatchPerformanceOfEventLeagueCriteria criteria)
        {
            var matchList = _automationTradingService.GetAutoTradingMatchPerformanceOfEventLeague(criteria);

            var jsonResult = Json(matchList);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult ExportMatchPerformanceOfEventLeague(GetMatchPerformanceOfEventLeagueCriteria criteria, string conditionKey)
        {
            var templatePath = Server.MapPath(FileMatchPerformance);

            criteria.MatchIdList = _automationTradingService.GetMatchIdListFromSession(conditionKey, Consts.AutomationTradingLeaguePerformanceOfEventSessionKey);

            _automationTradingService.ExportAutoTradingMatchPerformanceOfEventLeague(CurrentSession.UserId, criteria, templatePath);

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
            var models = _automationTradingService.GetAutoTradingModelPerformance(criteria);

            var jsonResult = Json(models);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.AutomationTradingPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
        public ActionResult ExportModelPerformance(GetModelPerformanceCriteria criteria)
        {
            var templatePath = Server.MapPath(FileModelPerformance);
            _automationTradingService.ExportAutoTradingModelPerformance(CurrentSession.UserId, criteria, templatePath);

            return new EmptyResult();
        }

        #endregion

    }
}