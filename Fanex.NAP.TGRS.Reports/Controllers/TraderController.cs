namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.Criteria.Trader;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Models.Trader;
    using Fanex.NAP.TGRS.Reports.Services.Implements;
    using Fanex.NAP.TGRS.Reports.Services.Interfaces;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceSummary;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using Fanex.NAP.TGRS.Reports.ViewModels.Trader;
    using Fanex.NAP.Core.Service.Interface;
    using Fanex.NAP.Core.Service.Impl;
    using Fanex.NAP.Core.Model;

    public class TraderController : TGRSBaseController
    {
        private readonly ITraderReportService traderReportService;
        private readonly IUserService userService;

        [Simplect.Attribute.InjectObject]
        public TraderController()
            : this(null, null)
        {
        }

        public TraderController(ITraderReportService traderReportService, IUserService userService)
        {
            this.traderReportService = traderReportService ?? new TraderReportService();
            this.userService = userService ?? new UserService();
        }

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

        public JsonResult GetReports(ReportFilter filter)
        {
            //var traderId = AppSession.CurrentUser.Id;
            //if (filter.Trader != null)
            //{
            //    var trader = userService.GetByUsername(filter.Trader.Trim()) as User;
            //    if (trader != null)
            //    {
            //        traderId = trader.Id;
            //    }
            //}
            var traderId = 2439;

            var generalInfo = GetGeneralInfo(traderId, filter.FromDate, filter.ToDate, filter.ReportType);
            var traderWinlossTurnover = GetTraderWinlossTurnover(traderId, filter.FromDate, filter.ToDate, filter.ReportType);
            var traderBettypePerformance = GetTraderBettypePerformance(traderId, filter.FromDate, filter.ToDate);
            var traderLeaguePerformance = GetTraderLeaguePerformance(traderId, filter.FromDate, filter.ToDate);

            TraderReports reports = new TraderReports()
            {
                GeneralInfo = generalInfo,
                BetTypePerformances = traderBettypePerformance,
                WinlossTurnover = traderWinlossTurnover,
                LeaguesPerformance = traderLeaguePerformance
            };
            return Json(reports);
        }

        private GeneralInfo GetGeneralInfo(int traderId, DateTime fromtDate, DateTime toDate, int reportType)
        {
            GetGeneralInfoCriteria criteria = new GetGeneralInfoCriteria()
            {
                TraderId = traderId,
                ReportType = reportType,
                FromDate = fromtDate,
                ToDate = toDate
            };

            return traderReportService.GetGeneralInfo(criteria).FirstOrDefault();
        }

        private List<TraderWinlossTurnover> GetTraderWinlossTurnover(int traderId, DateTime fromtDate, DateTime toDate, int reportType)
        {
            GetTraderWinLossTurnoverCriteria criteria = new GetTraderWinLossTurnoverCriteria()
            {
                TraderId = traderId,
                ReportType = reportType,
                FromDate = fromtDate,
                ToDate = toDate
            };

            return traderReportService.GetTraderWinlossTurnover(criteria).ToList();
        }

        private List<BetTypePerformance> GetTraderBettypePerformance(int traderId, DateTime fromtDate, DateTime toDate)
        {
            GetTraderBetTypePerformanceCriteria criteria = new GetTraderBetTypePerformanceCriteria()
            {
                TraderId = traderId,
                FromDate = fromtDate,
                ToDate = toDate
            };

            return traderReportService.GetTraderBettypePerformance(criteria).ToList();
        }

        private List<LeaguePerformance> GetTraderLeaguePerformance(int traderId, DateTime fromtDate, DateTime toDate)
        {
            GetTraderLeaguePerformanceCriteria criteria = new GetTraderLeaguePerformanceCriteria()
            {
                TraderId = traderId,
                FromDate = fromtDate,
                ToDate = toDate
            };

            return traderReportService.GetTraderLeaguePerformance(criteria).ToList();
        }
    }
}