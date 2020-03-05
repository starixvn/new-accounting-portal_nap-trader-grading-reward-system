namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;    
    using Fanex.NAP.TGRS.Reports.Services;
    using Fanex.NAP.TGRS.Reports.Criteria.MultipleMatchesPerformance;
    using System;
    using System.Web.Mvc;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance;

    public class MultipleMatchesPerformanceController : TGRSBaseController
    {
        #region Attributes and Constructors
        private const string TraderPerformanceDetail = @"~\Areas\Reports\ExcelTemplates\MultipleMatchesPerformance\TraderPerformance.xls";
        private readonly IMultipleMatchesReportService _traderReportService;

        [Simplect.Attribute.InjectObject]
        public MultipleMatchesPerformanceController() : this(null)
        {
            DateTime minDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);
            minDate = minDate < AppSettings.AvailableDate ? AppSettings.AvailableDate : minDate;

            ViewBag.MinDate = minDate;
            ViewBag.DefaultFromDate = DateTime.Today.AddDays(AppSettings.PerformanceDefaultDayRange * -1);
            ViewBag.DefaultToDate = DateTime.Today;
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;
        }

        public MultipleMatchesPerformanceController(IMultipleMatchesReportService traderReportService)
        {
            this._traderReportService = traderReportService ?? new MultipleMatchesTraderReportService();
        }
        #endregion Attributes and Constructors

        #region Trader Performance
        /// <summary>
        /// Gets Index page.
        /// </summary>
        /// <returns>Return Index View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.MultipleMatchesPerformance, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return RedirectToAction("TraderPerformance");
        }

        /// <summary>
        /// Gets LeaguePerformance page.
        /// </summary>
        /// <returns>Return LeaguePerformance View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.MultipleMatchesPerformance, Policy = Constant.Policy.Read)]
        public ActionResult TraderPerformance()
        {
            ViewBag.Bettypes = this._traderReportService.GetBetTypes(CurrentSession.UserId);
            ViewBag.Teams = this._traderReportService.GetTeams();

            return View();
        }

        /// <summary>
        /// Gets the trader performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the trader performance data.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.MultipleMatchesPerformance, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformance(GetTraderPerformanceCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var traderPerformance = this._traderReportService.GetTraderPerformance(criteria);
            var jsonResult = Json(traderPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }

        /// <summary>
        /// Exports the trader performance.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>Excel file.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.MultipleMatchesPerformance, Policy = Constant.Policy.Read)]
        public ActionResult ExportTraderPerformance(GetTraderPerformanceCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var templatePath = Server.MapPath(TraderPerformanceDetail);

            this._traderReportService.ExportTraderPerformance(CurrentSession.UserId, criteria, templatePath);

            return new EmptyResult();
        }

        /// <summary>
        /// Gets the match performance of a trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the match performance of a trader data.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.MultipleMatchesPerformance, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfTrader(GetMatchPerformanceOfTraderCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;

            var martchPerformance = this._traderReportService.GetMatchPerformanceOfTrader(criteria, true);
            var jsonResult = Json(martchPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.MultipleMatchesPerformance, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchDetailPerformanceOfTrader(GetMatchPerformanceOfTraderCriteria criteria)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;

            var martchPerformance = this._traderReportService.GetMatchPerformanceOfTrader(criteria, false);
            var jsonResult = Json(martchPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }

        /// <summary>
        /// Gets bet type detail from trader report.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the bet type detail.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.MultipleMatchesPerformance, Policy = Constant.Policy.Read)]
        public JsonResult GetBettypeTrader(GetBettypeDetailOfTraderCriteria criteria, string subMatchIds)
        {
            criteria.IsExcludeLeagues = AppSession.IsExcludingLeagues;
            var bettypeDetail = this._traderReportService.GetBettypeTrader(criteria, subMatchIds);
            var jsonResult = Json(bettypeDetail);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }
        #endregion
    }
}