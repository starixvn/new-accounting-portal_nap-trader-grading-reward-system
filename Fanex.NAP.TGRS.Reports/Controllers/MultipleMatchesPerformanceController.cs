namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;    
    using Fanex.NAP.TGRS.Reports.Services;
    using Fanex.NAP.TGRS.Reports.Criteria.MultipleMatchesPerformance;
    using Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance;
    using System;
    using System.Web.Mvc;
  
    public class MultipleMatchesPerformanceController : TGRSBaseController
    {
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
            var traderPerformance = this._traderReportService.GetTraderPerformance(criteria);
            var jsonResult = Json(traderPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }

        /// <summary>
        /// Gets the match performance of a trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object contains the match performance of a trader data.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        public JsonResult GetMatchPerformanceOfTrader(GetMatchPerformanceOfTraderCriteria criteria)
        {
            var martchPerformance = this._traderReportService.GetMatchPerformanceOfTrader(criteria);
            var jsonResult = Json(martchPerformance);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }
       
        #endregion
    }
}