namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.Reports.Criteria.Trader;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Models.Trader;
    using Fanex.NAP.TGRS.Reports.Services.Interfaces;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Web.Mvc;

    public class TraderController : TGRSBaseController
    {
        private readonly ITraderReportService traderReportService;

        public TraderController() { }

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

        public JsonResult GetReport(int traderId, int reportType, DateTime fromtDate, DateTime toDate)
        {
            
            return Json("123");
        }

        private List<GeneralInfo> GetGeneralInfo(int traderId, int reportType, DateTime fromtDate, DateTime toDate)
        {
            GetGeneralInfoCriteria criteria = new GetGeneralInfoCriteria()
            {
                TraderId = traderId,
                ReportType = reportType,
                FromDate = fromtDate,
                ToDate = toDate
            };

            return traderReportService.GetGeneralInfo(criteria).ToList();
        }

        private List<TraderWinlossTurnover> GetTraderWinlossTurnover(int traderId, int reportType, DateTime fromtDate, DateTime toDate)
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