namespace Fanex.NAP.TGRS.OSReports.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSReports.Models.Dashboard;
    using Fanex.NAP.TGRS.OSReports.Services;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System.Web.Mvc;

    public class OSDashboardController : TGRSBaseController
    {
        private readonly IDashboardService _dashboardService;

        private int _numOfSport = 10;

        private int _numOfTrader = 5;

        [Simplect.Attribute.InjectObject]
        public OSDashboardController()
            : this(null)
        {
        }

        public OSDashboardController(IDashboardService dashboardService)
        {
            this._dashboardService = dashboardService ?? new DashboardService();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSPerformanceSummary, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            ViewBag.CanViewDashboard = this.HasRight(TGRSFunctionKeys.PerformanceSummary, Constant.Policy.Read);

            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.OSPerformanceSummary, Policy = Constant.Policy.Read)]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Need Review.")]
        public JsonResult GetSummaryData(int month)
        {
            var monthData = _dashboardService.GetDataByMonth(month);
            var lastYearMonthData = _dashboardService.GetDataByMonthLastYear(month);
            var bestSports = _dashboardService.GetTopNBestSports(month, _numOfSport);
            var worstTraders = _dashboardService.GetTopNWorstTraders(month, _numOfTrader);
            var regionData = _dashboardService.GetDataByRegion(month);
            var teamData = _dashboardService.GetDataByTeam(month);
            var years = monthData.Select(t => t.Year).Union(lastYearMonthData.Select(x => x.Year)).Distinct().OrderBy(t => t);

            return Json(
                new
                {
                    SummaryData = new
                    {
                        Years = years,
                        MonthData = monthData.OrderBy(t => t.EventDate),
                        LastYearMonthData = lastYearMonthData.OrderBy(t => t.EventDate),
                        RegionData = regionData.OrderBy(t => t.RegionName),
                        TeamData = teamData.OrderBy(t => t.TeamName)
                    },
                    BestSports = bestSports,
                    WorstTraders = worstTraders
                });
        }
    }
}