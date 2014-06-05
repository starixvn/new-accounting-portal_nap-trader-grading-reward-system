// --------------------------------------------------------------------------
// <copyright file="PerformanceSummaryController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.19">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Services.Implement.SummaryReport;
    using Fanex.NAP.TGRS.Reports.Services.Interface.SummaryReport;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceSummary;

    /// <summary>
    /// Performance summary report controller.
    /// </summary>
    public class PerformanceSummaryController : TGRSBaseController
    {
        private readonly ISummaryReportService _summaryReportService;

        public PerformanceSummaryController()
            : this(null)
        {
        }

        public PerformanceSummaryController(ISummaryReportService summaryReportService)
        {
            this._summaryReportService = summaryReportService ?? new SummaryReportService();
        }

        /// <summary>
        /// Gets Index page.
        /// </summary>
        /// <returns>Return Index View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Gets TraderRank page.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>TraderRank view.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public ActionResult TraderRank(GetTopTraderCriteria criteria)
        {
            return View(criteria);
        }

        /// <summary>
        /// Get Summary Info.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>List of JSON objects.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public JsonResult GetGeneralInfo(GetGeneralInfoCriteria criteria)
        {
            GeneralInfo result = this._summaryReportService.GetGeneralInfo(criteria).First();

            return Json(result);
        }

        /// <summary>
        /// Get Team Performance.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>List of JSON objects.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public JsonResult GetTeamPerformance(GetTeamPerformanceCriteria criteria)
        {
            IEnumerable<TeamPerformance> result = this._summaryReportService.GetTeamPerformance(criteria);

            return Json(result);
        }

        /// <summary>
        /// Get Trader Performance.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>List of JSON objects.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderPerformance(GetTraderPerformanceCriteria criteria)
        {
            TraderPerformance result = this._summaryReportService.GetTraderPerformance(criteria).First();

            return Json(result);
        }

        /// <summary>
        /// Get Bet Type Performance.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>List of JSON objects.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public JsonResult GetBetTypePerformance(GetBetTypePerformanceCriteria criteria)
        {
            IEnumerable<BetTypePerformance> result = this._summaryReportService.GetBetTypePerformance(criteria);

            return Json(result);
        }

        /// <summary>
        /// Get Top Win League.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>List of JSON objects.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public JsonResult GetTopWinLeague(GetTopWinLeagueCriteria criteria)
        {
            IEnumerable<League> result = this._summaryReportService.GetTopWinLeague(criteria);

            return Json(result);
        }

        /// <summary>
        /// Get Top Lose League.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>List of JSON objects.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public JsonResult GetTopLoseLeague(GetTopLoseLeagueCriteria criteria)
        {
            IEnumerable<League> result = this._summaryReportService.GetTopLoseLeague(criteria);

            return Json(result);
        }

        /// <summary>
        /// Get performance summary reports.
        /// </summary>
        /// <param name="filter">Filter model of performance summary reports.</param>
        /// <returns>List of JSON objects.</returns>
        public JsonResult GetReports(ReportFilter filter)
        {
            var generalCriteria = new GetGeneralInfoCriteria() { ReportType = filter.ReportType, FromDate = filter.FromDate, ToDate = filter.ToDate };
            GeneralInfo generalInfo = this._summaryReportService.GetGeneralInfo(generalCriteria).First();

            var teamCriteria = new GetTeamPerformanceCriteria { ReportType = filter.ReportType, FromDate = filter.FromDate, ToDate = filter.ToDate };
            IEnumerable<TeamPerformance> teamResult = this._summaryReportService.GetTeamPerformance(teamCriteria);

            var traderCriteria = new GetTraderPerformanceCriteria() { ReportType = filter.ReportType, FromDate = filter.FromDate, ToDate = filter.ToDate };
            TraderPerformance traderResult = this._summaryReportService.GetTraderPerformance(traderCriteria).First();

            var betTypeCriteria = new GetBetTypePerformanceCriteria() { ReportType = filter.ReportType, FromDate = filter.FromDate, ToDate = filter.ToDate };
            IEnumerable<BetTypePerformance> betTypeResult = this._summaryReportService.GetBetTypePerformance(betTypeCriteria);

            var winLeagueCriteria = new GetTopWinLeagueCriteria() { ReportType = filter.ReportType, FromDate = filter.FromDate, ToDate = filter.ToDate };
            IEnumerable<League> winLeagueResult = this._summaryReportService.GetTopWinLeague(winLeagueCriteria);

            var loseLeagueCriteria = new GetTopLoseLeagueCriteria() { ReportType = filter.ReportType, FromDate = filter.FromDate, ToDate = filter.ToDate };
            IEnumerable<League> loseLeagueResult = this._summaryReportService.GetTopLoseLeague(loseLeagueCriteria);

            Reports reports = new Reports()
            {
                GeneralInfo = generalInfo,
                TeamPerformances = teamResult,
                TraderPerformance = traderResult,
                BetTypePerformances = betTypeResult,
                WinLeagues = winLeagueResult,
                LoseLeagues = loseLeagueResult
            };

            return Json(reports);
        }

        /// <summary>
        /// Get top, bottom trader by performance.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>List of JSON objects.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderRankData(GetTopTraderCriteria criteria)
        {
            IEnumerable<TopTrader> result = this._summaryReportService.GetTopTrader(criteria);

            return Json(result);
        }

        /// <summary>
        /// Get Top Trader.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>List of JSON objects.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public JsonResult GetTopTrader(GetTopTraderCriteria criteria)
        {
            IEnumerable<TopTrader> result = this._summaryReportService.GetTopTrader(criteria);

            return Json(result);
        }

        /// <summary>
        /// Get team history of trader.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>List of JSON objects.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public JsonResult GetTeamHistory(GetTeamHistoryCriteria criteria)
        {
            IEnumerable<TeamHistoryDetailItem> result = this._summaryReportService.GetTeamHistory(criteria);

            return Json(result);
        }

        /// <summary>
        /// Get grade history of trader.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>List of JSON objects.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public JsonResult GetGradeHistory(GetGradeHistoryCriteria criteria)
        {
            IEnumerable<GradeHistoryDetailItem> result = this._summaryReportService.GetGradeHistory(criteria);

            return Json(result);
        }
    }
}