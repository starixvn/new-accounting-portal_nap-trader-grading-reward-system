namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.Criteria.Trader;
    using Fanex.NAP.TGRS.Reports.Criteria.TraderManagement;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Models.Permission;
    using Fanex.NAP.TGRS.Reports.Models.Trader;
    using Fanex.NAP.TGRS.Reports.Services.Implements;
    using Fanex.NAP.TGRS.Reports.Services.Interfaces;
    using Fanex.NAP.TGRS.Reports.Services.TraderManagement;
    using Fanex.NAP.TGRS.Reports.ViewModel.TraderManagement;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.ViewModels.Trader;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;

    public class TraderController : TGRSBaseController
    {
        private readonly ITraderReportService traderReportService;
        private readonly ITraderManagementService traderMgnt;

        private BettypeViewPermission _permission;

        [Simplect.Attribute.InjectObject]
        public TraderController()
            : this(null, null)
        {
            _permission = ReportUtil.GetBettypeViewPermission(HasRight, TGRSFunctionKeys.TraderReportAdmin_PHbettypes, TGRSFunctionKeys.TraderReportAdmin_Majorbettypes);
        }

        public TraderController(ITraderReportService traderReportService, ITraderManagementService traderMgnt)
        {
            this.traderReportService = traderReportService ?? new TraderReportService();
            this.traderMgnt = traderMgnt ?? new TraderManagementService();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.TraderReport, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            DateTime minDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);
            minDate = minDate < AppSettings.AvailableDate ? AppSettings.AvailableDate : minDate;

            ViewBag.MinDate = minDate;
            ViewBag.DefaultFromDate = DateTime.Today.AddDays(AppSettings.PerformanceDefaultDayRange * -1);
            ViewBag.DefaultToDate = DateTime.Today;
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;
            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.TraderReportAdmin, Policy = Constant.Policy.Read)]
        public ActionResult Admin()
        {
            if (_permission == BettypeViewPermission.None) return Redirect("~/Error/AccessDenied");

            DateTime minDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);
            minDate = minDate < AppSettings.AvailableDate ? AppSettings.AvailableDate : minDate;

            ViewBag.MinDate = minDate;
            ViewBag.DefaultFromDate = DateTime.Today.AddDays(AppSettings.PerformanceDefaultDayRange * -1);
            ViewBag.DefaultToDate = DateTime.Today;
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;
            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.TraderReport, Policy = Constant.Policy.Read)]
        public JsonResult GetReportsForTrader(ReportFilter filter)
        {
            _permission = BettypeViewPermission.All;
            return GetReports(filter);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.TraderReportAdmin, Policy = Constant.Policy.Read)]
        public JsonResult GetReportsForAdminTrader(ReportFilter filter)
        {
            return GetReports(filter);
        }

        [HttpPost]
        public JsonResult ReloadChart(ReportFilter filter)
        {
            CheckComeFromTraderReport();

            var traderId = this.CurrentSession.UserId;

            if (filter.Trader != null)
            {
                GetAllTradersCriteria criteria = new GetAllTradersCriteria()
                {
                    UserName = filter.Trader
                };
                TraderInfoItem trader = traderMgnt.GetAllTrader(criteria).TraderInfoItems.FirstOrDefault();
                if (trader != null)
                {
                    traderId = trader.CustId;
                }
            }

            GetTraderWinLossTurnoverCriteria criteriaWLTO = new GetTraderWinLossTurnoverCriteria()
            {
                TraderId = traderId,
                ReportType = filter.ReportType,
                FromDate = filter.FromDate,
                ToDate = filter.ToDate,
                ViewPermission = (int)_permission,
                IsExcludeLeagues = AppSession.IsExcludingLeagues
            };

            return Json(traderReportService.GetTraderWinlossTurnover(criteriaWLTO).ToList());
        }

        [HttpPost]
        public JsonResult GetMatchOfLeague(ReportFilter filter)
        {
            var traderId = this.CurrentSession.UserId;

            if (filter.Trader != null)
            {
                GetAllTradersCriteria criteria = new GetAllTradersCriteria()
                {
                    UserName = filter.Trader
                };
                TraderInfoItem trader = traderMgnt.GetAllTrader(criteria).TraderInfoItems.FirstOrDefault();
                if (trader != null)
                {
                    traderId = trader.CustId;
                }
            }

            GetTraderLeaguePerformanceDetailCriteria detailCriteria = new GetTraderLeaguePerformanceDetailCriteria()
            {
                TraderId = traderId,
                FromDate = filter.FromDate,
                ToDate = filter.ToDate,
                LeagueId = filter.LeagueId,
                IsExcludeLeagues = AppSession.IsExcludingLeagues
            };
            var result = traderReportService.GetMatchPerformanceOfLeague(detailCriteria);
            return Json(result);
        }

        [HttpPost]
        public JsonResult GetBettypeOfMatch(ReportFilter filter)
        {
            var traderId = this.CurrentSession.UserId;

            if (filter.Trader != null)
            {
                GetAllTradersCriteria criteria = new GetAllTradersCriteria()
                {
                    UserName = filter.Trader
                };
                TraderInfoItem trader = traderMgnt.GetAllTrader(criteria).TraderInfoItems.FirstOrDefault();
                if (trader != null)
                {
                    traderId = trader.CustId;
                }
            }

            GetTraderLeaguePerformanceMatchDetailCriteria bettypeCriteria = new GetTraderLeaguePerformanceMatchDetailCriteria()
            {
                TraderId = traderId,
                EventDate = filter.EventDate,
                MatchId = filter.MatchId,
                IsExcludeLeagues = AppSession.IsExcludingLeagues
            };
            var result = traderReportService.GetBetTypeOfMatch(bettypeCriteria).ToList();
            return Json(result);
        }

        private JsonResult GetReports(ReportFilter filter)
        {
            var traderId = this.CurrentSession.UserId;

            if (filter.Trader != null)
            {
                GetAllTradersCriteria criteria = new GetAllTradersCriteria()
                {
                    UserName = filter.Trader
                };
                TraderInfoItem trader = traderMgnt.GetAllTrader(criteria).TraderInfoItems.FirstOrDefault();
                if (trader != null)
                {
                    traderId = trader.CustId;
                }
            }

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
                ToDate = toDate,
                ViewPermission = (int)_permission,
                IsExcludeLeagues = AppSession.IsExcludingLeagues
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
                ToDate = toDate,
                ViewPermission = (int)_permission,
                IsExcludeLeagues = AppSession.IsExcludingLeagues
            };

            return traderReportService.GetTraderWinlossTurnover(criteria).ToList();
        }

        private List<BetTypePerformance> GetTraderBettypePerformance(int traderId, DateTime fromtDate, DateTime toDate)
        {
            GetTraderBetTypePerformanceCriteria criteria = new GetTraderBetTypePerformanceCriteria()
            {
                TraderId = traderId,
                FromDate = fromtDate,
                ToDate = toDate,
                ViewPermission = (int)_permission,
                IsExcludeLeagues = AppSession.IsExcludingLeagues
            };

            return traderReportService.GetTraderBettypePerformance(criteria).ToList();
        }

        private LeaguePerformanceList GetTraderLeaguePerformance(int traderId, DateTime fromtDate, DateTime toDate)
        {
            GetTraderLeaguePerformanceCriteria criteria = new GetTraderLeaguePerformanceCriteria()
            {
                TraderId = traderId,
                FromDate = fromtDate,
                ToDate = toDate,
                ViewPermission = (int)_permission,
                IsExcludeLeagues = AppSession.IsExcludingLeagues
            };

            return traderReportService.GetTraderLeaguePerformance(criteria);
        }

        private void CheckComeFromTraderReport()
        {
            var referrer = Request.UrlReferrer;

            var action = referrer.Segments[referrer.Segments.Length - 1];

            if (action == "Trader") _permission = BettypeViewPermission.All;
        }
    }
}