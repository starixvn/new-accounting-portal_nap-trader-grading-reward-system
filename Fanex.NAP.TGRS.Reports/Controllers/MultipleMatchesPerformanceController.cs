namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.Reports.Services;
    using Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
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
        /// Gets initialized data for index page.
        /// </summary>
        /// <returns>List of JSON objects represents the team list and grade list.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceDetail, Policy = Constant.Policy.Read)]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Reviewed.")]
        public JsonResult GetDefaultBettypes()
        {
            IEnumerable<BetTypeItem> betTypes = this._traderReportService.GetBetTypesFromSession(CurrentSession.UserId);

            return Json(new
            {
                DefaultBettypes = from betType in betTypes where betType.IsDefaultCheck select betType.BetTypeId
            });
        }

        #endregion

    }
}