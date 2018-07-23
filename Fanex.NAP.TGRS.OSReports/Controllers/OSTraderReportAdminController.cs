namespace Fanex.NAP.TGRS.OSReports.Controllers
{
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.OSReports.Criteria.SportPerformance;
    using Fanex.NAP.TGRS.OSReports.Criteria.TraderReport;
    using Fanex.NAP.TGRS.OSReports.Services.Implement;
    using Fanex.NAP.TGRS.OSReports.Services.Interface;
    using System;
    using System.Linq;
    using System.Web.Mvc;

    [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderReportAdmin, Policy = NAP.Core.Business.Constant.Policy.Read)]
    public class OSTraderReportAdminController : TGRSBaseController
    {
        private ITraderReportService _service = new TraderReportService();

        private ISportPerformanceService _sportService = new SportPerformanceService();

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

        public ActionResult GetGeneralInfo(GetGeneralInfoCriteria criteria)
        {
            var trader = _service.GetGeneralInfo(criteria);

            Session.Add("traderId", trader.TraderId);

            var sports = _service.GetSportPerformance(new Criteria.TraderReport.GetSportPerformanceCriteria
            {
                TraderId = trader.TraderId,
                FromDate = criteria.FromDate,
                ToDate = criteria.ToDate,
                ReportType = criteria.ReportType
            });

            return Json(new { trader, sports }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetChartData(GetChartDataCriteria criteria)
        {
            criteria.TraderId = (int)Session["traderId"];

            return Json(_service.GetChartData(criteria), JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetRegionData(GetRegionBySportCriteria criteria)
        {
            criteria.TraderId = (int)Session["traderId"];

            var data = _sportService.GetRegionPerformances(criteria)
                .OrderByDescending(r => r.Turnover)
                .ThenByDescending(r => r.WinLoss)
                .ThenByDescending(r => r.Margin);

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetLeagueData(GetLeaguePerformanceCriteria criteria)
        {
            criteria.TraderId = (int)Session["traderId"];

            var data = _sportService.GetLeaguePerformance(criteria)
                .OrderByDescending(l => l.Turnover)
                .ThenByDescending(l => l.VWinLoss)
                .ThenByDescending(l => l.VMargin);

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetBettypeData(GetBettypePerformanceCriteria criteria)
        {
            criteria.TraderId = (int)Session["traderId"];

            var data = _sportService.GetBettypePerformance(criteria)
                .OrderByDescending(l => l.Turnover)
                .ThenByDescending(l => l.VWinLoss)
                .ThenByDescending(l => l.VMargin);

            return Json(data, JsonRequestBehavior.AllowGet);
        }
    }
}