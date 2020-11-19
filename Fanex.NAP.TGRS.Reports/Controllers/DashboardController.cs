namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.Core.Helpers;       
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Services;
    using Fanex.NAP.TGRS.Reports.ViewModels.Dashboard;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System.Web.Mvc;

    /// <summary>
    /// Performance summary report controller.
    /// </summary>
    public class DashboardController : TGRSBaseController
    {
        private readonly IDashboardService _dashboardService;

        private int _permission;

        [Simplect.Attribute.InjectObject]
        public DashboardController()
            : this(null)
        {
            _permission = (int)ReportUtil.GetBettypeViewPermission(HasRight, TGRSFunctionKeys.Dashboard_PHbettypes, TGRSFunctionKeys.Dashboard_Majorbettypes);
        }

        public DashboardController(IDashboardService dashboardService)
        {
            this._dashboardService = dashboardService ?? new DashboardService(AppSession.IsExcludingLeagues);
        }

        /// <summary>
        /// Gets Index page.
        /// </summary>
        /// <returns>Return Index View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            if ((Models.Permission.BettypeViewPermission)_permission == Models.Permission.BettypeViewPermission.None) return View("~/Views/Home/Index.cshtml");

            ViewBag.CanViewOSDashboard = this.HasRight(TGRSFunctionKeys.OSPerformanceSummary, Constant.Policy.Read);            
            ViewBag.CanViewBasketballDashboard = this.HasRight(TGRSFunctionKeys.PerformanceSummaryComparison, Constant.Policy.Read);

            return View();
        }

        /// <summary>
        /// Gets the summary data.
        /// </summary>
        /// <param name="month">The month.</param>
        /// <returns>
        /// JOSN result of action.
        /// </returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Need Review.")]
        public JsonResult GetSummaryData(int month)
        {
            GeneralInfo generalInfo = this._dashboardService.GetGeneralInfo(month, _permission).First();
            IEnumerable<League> bestLeagues = this._dashboardService.GetTopWinLeague(month, _permission);
            IEnumerable<TopTrader> bestTraders = this._dashboardService.GetTopTrader(month, _permission);
            IEnumerable<BetTypePerformance> bestBettypes = this._dashboardService.GetTopBettype(month, _permission);
            IEnumerable<MonthAmountItem> monthData = this._dashboardService.GetSummaryData(month, _permission);
            IEnumerable<TeamPerformance> teamData = this._dashboardService.GetTeamData(month, _permission);
            return Json(
                new
                {
                    GeneralInfo = generalInfo,
                    SummaryData = new
                    {
                        MonthData = monthData,
                        TeamData = teamData
                    },
                    BestLeagues = bestLeagues,
                    BestTraders = bestTraders,
                    BestBettypes = bestBettypes
                });
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public JsonResult GetTeamData(int month)
        {
            IEnumerable<TeamPerformance> teamData = this._dashboardService.GetTeamData(month, _permission);

            return Json(new
            {
                TeamData = teamData
            });
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummaryComparison, Policy = Constant.Policy.Read)]
        public JsonResult GetDate(BasketballDays days)
        {
            var toDay = DateTime.Today;
            var data = new
            {
                FromDate = toDay.ToString(),
                ToDate = toDay.ToString()
            };

            switch (days)
            {
                case BasketballDays.Days7:
                    data = new
                    {
                        FromDate = toDay.AddDays(-7).ToString(),
                        ToDate = toDay.ToString()
                    };
                    break;
                case BasketballDays.Days30:
                    data = new
                    {
                        FromDate = toDay.AddDays(-30).ToString(),
                        ToDate = toDay.ToString()
                    };
                    break;
                default:
                    break;
            }

            return Json(data, JsonRequestBehavior.AllowGet);
        }
    }
}