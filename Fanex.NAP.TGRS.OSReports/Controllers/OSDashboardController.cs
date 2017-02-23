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
            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.OSPerformanceSummary, Policy = Constant.Policy.Read)]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Need Review.")]
        public JsonResult GetSummaryData(int month)
        {
            var currentData = _dashboardService.GetDataByMonth(month);
            var lastYearData = _dashboardService.GetDataByMonthLastYear(month);
            var bestSports = _dashboardService.GetTopNBestSports(month, _numOfSport);
            var worstTraders = _dashboardService.GetTopNWorstTraders(month, _numOfTrader);
            var monthData = currentData.GroupBy(t => t.MonthYear).Select(t => new DataByMonth
            {
                MatchCount = t.Sum(x => x.MatchCount),
                Month = t.ElementAt(0).Month,
                Year = t.ElementAt(0).Year,
                Winloss = t.Sum(x => x.Winloss),
                Turnover = t.Sum(x => x.Turnover)
            });
            var lastYearMonthData = lastYearData.GroupBy(t => t.MonthYear).Select(t => new DataByMonth
            {
                MatchCount = t.Sum(x => x.MatchCount),
                Month = t.ElementAt(0).Month,
                Year = t.ElementAt(0).Year,
                Winloss = t.Sum(x => x.Winloss),
                Turnover = t.Sum(x => x.Turnover)
            });
            var regionData = currentData.GroupBy(t => t.RegionName).Select(t => new DataByMonth
            {
                MatchCount = t.Sum(x => x.MatchCount),
                RegionName = t.ElementAt(0).RegionName,
                Winloss = t.Sum(x => x.Winloss),
                Turnover = t.Sum(x => x.Turnover)
            });
            var teamData = currentData.GroupBy(t => t.TeamName).Select(t => new DataByMonth
            {
                MatchCount = t.Sum(x => x.MatchCount),
                TeamName = t.ElementAt(0).TeamName,
                Winloss = t.Sum(x => x.Winloss),
                Turnover = t.Sum(x => x.Turnover)
            });

            return Json(
                new
                {
                    SummaryData = new
                    {
                        MonthData = monthData.OrderBy(t => t.MonthYear),
                        LastYearMonthData = lastYearMonthData.OrderBy(t => t.MonthYear),
                        RegionData = regionData.OrderBy(t => t.RegionName),
                        TeamData = teamData.OrderBy(t => t.TeamName)
                    },
                    BestSports = bestSports,
                    WorstTraders = worstTraders
                });
        }
    }
}