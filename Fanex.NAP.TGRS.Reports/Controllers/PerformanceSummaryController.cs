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
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Services;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceSummary;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Mvc;

    /// <summary>
    /// Performance summary report controller.
    /// </summary>
    public class PerformanceSummaryController : TGRSBaseController
    {
        private readonly ISummaryReportService _summaryReportService;

        private readonly IDetailReportService _detailReportService;

        [Simplect.Attribute.InjectObject]
        public PerformanceSummaryController()
            : this(null, null)
        {
        }

        public PerformanceSummaryController(ISummaryReportService summaryReportService, IDetailReportService detailReportService)
        {
            this._summaryReportService = summaryReportService ?? new SummaryReportService();
            _detailReportService = new DetailReportService();
        }

        /// <summary>
        /// Gets Index page.
        /// </summary>
        /// <returns>Return Index View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            DateTime minDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);
            minDate = minDate < AppSettings.AvailableDate ? AppSettings.AvailableDate : minDate;

            ViewBag.MinDate = minDate;
            ViewBag.DefaultFromDate = DateTime.Today.AddDays(AppSettings.PerformanceDefaultDayRange * -1);
            ViewBag.DefaultToDate = DateTime.Today.AddDays(-1);
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;
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

        #region Parrallel Tasks

        private void GetLeagueResult(string bettypes, ReportFilter filter, out GeneralInfo generalInfo, out IEnumerable<League> topWin, out IEnumerable<League> topLose)
        {
            var leagueCriteria = new Criteria.PerformanceDetail.GetLeaguePerformanceCriteria
            {
                LeagueName = string.Empty,
                FromDate = filter.FromDate,
                ToDate = filter.ToDate,
                BetTypes = bettypes
            };

            var leagues = _detailReportService.GetLeaguePerformance(leagueCriteria);
        }

        private void GetTeamResult(string bettypes, ReportFilter filter, out IEnumerable<TeamPerformance> teamResult)
        {
            var teamCriteria = new Criteria.PerformanceDetail.GetTeamPerformanceCriteria
            {
                TeamIds = string.Empty,
                FromDate = filter.FromDate,
                ToDate = filter.ToDate,
                BetTypes = bettypes
            };

            teamResult =
                _detailReportService
                    .GetTeamPerformance(criteria)
                    .ItemList
                    .Select(t => new TeamPerformance
                    {
                        TeamId = t.TeamId,
                        TeamName = t.TeamName,
                        Margin = t.Margin,
                        Match = t.NoOfMatches,
                        Turnover = t.Turnover,
                        Winlost = t.WinLoss
                    });
        }

        private void GetTraderResult(string bettypes, ReportFilter filter, out TraderPerformance traderResult)
        {
            var criteria = new Criteria.PerformanceDetail.GetTraderPerformanceCriteria
            {
                BetTypes = bettypes,
                FromDate = filter.FromDate,
                ToDate = filter.ToDate,
                Username = string.Empty
            };

            var traders = _detailReportService.GetTraderPerformance(criteria);

            traderResult = new TraderPerformance
            {
                
            }
        }

        private void GetBettypeResult(string bettypes, ReportFilter filter, out IEnumerable<BetTypePerformance> bettypeResult)
        {
            var criteria = new Criteria.PerformanceDetail.GetBetTypePerformanceCriteria
            {
                Bettypes = bettypes,
                FromDate = filter.FromDate,
                ToDate = filter.ToDate
            };

            bettypeResult = 
                _detailReportService
                .GetBetTypePerformance(criteria)
                .ItemList
                .Select(bt => new BetTypePerformance
                {
                    BetCount = bt.BetCount,
                    BetType = bt.BetTypeId,
                    TypeName = bt.BetTypeName,
                    Margin = bt.Margin,
                    Turnover = bt.Turnover,
                    Winlost = bt.WinLoss
                });
        }
        #endregion Parrallel Tasks
    }
}