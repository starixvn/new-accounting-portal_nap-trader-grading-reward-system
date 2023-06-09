namespace Fanex.NAP.TGRS.OSReports.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformanceByCC;
    using Fanex.NAP.TGRS.OSReports.Models.TraderPerformanceByCC;
    using Fanex.NAP.TGRS.OSReports.Services.Interface;
    using System;
    using System.Collections.Generic;
    using System.Web.Mvc;

    public class OSTraderPerformanceByCCController : TGRSBaseController
    {
        private readonly ITraderPerformanceByCCService _service;

        public OSTraderPerformanceByCCController(ITraderPerformanceByCCService service)
        {
            _service = service;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderPerformanceByCC, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            DateTime minDate = new DateTime(DateTime.Today.AddYears(AppSettings.PerformanceYearRange * -1).Year, 1, 1);
            minDate = minDate < AppSettings.AvailableDate ? AppSettings.AvailableDate : minDate;

            //var ctsCustomerClass = _service.GetCTSCustomerClassFilter();

            var ctsCustomerClass = new List<CustomerClassViewModel>()
            {
                new CustomerClassViewModel
                {
                    CustomerClassGroupID = 1,
                    CustomerClassGroupName = "Normal",
                    ClassList = new List<int>{111,222,333}
                },
                new CustomerClassViewModel
                {
                    CustomerClassGroupID = 2,
                    CustomerClassGroupName = "Problem Account",
                    ClassList = new List<int>{444,555,666}
                },
                new CustomerClassViewModel
                {
                    CustomerClassGroupID = 3,
                    CustomerClassGroupName = "Probation",
                    ClassList = new List<int>{777,888,999}
                }
            };

            var sports = _service.GetSportFilter();

            ViewBag.MinDate = minDate;
            ViewBag.DefaultFromDate = DateTime.Today.AddDays(AppSettings.PerformanceDefaultDayRange * -1);
            ViewBag.DefaultToDate = DateTime.Today.AddDays(-1);
            ViewBag.AllowYearRange = AppSettings.PerformanceAllowYearRange;
            ViewBag.sports = sports;
            ViewBag.ctsCustomerClass = ctsCustomerClass;

            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderPerformanceByCC, Policy = Constant.Policy.Read)]
        public ActionResult GetTraderPerformanceByCC(GetTraderPerformanceByCCCriteria criteria)
        {
            criteria.TraderName = criteria.TraderName ?? string.Empty;
            criteria.TraderName = criteria.TraderName.Trim();

            //var example = _service.GetTraderPerformancesByCC(criteria);

            var example = new List<TraderPerformanceByCCModel>()
            {
                new TraderPerformanceByCCModel()
                {
                    TraderId = 1,
                    TraderName = "c",
                    BetCount= 1,
                    CustomerClass=3,
                    Margin =1,
                    MarginReal =1,
                    Turnover=1,
                    TurnoverReal=1,
                    WinLoss=1,
                    WinLossReal =1
                },
                new TraderPerformanceByCCModel()
                {
                    TraderId = 1,
                    TraderName = "c",
                    BetCount= 1,
                    CustomerClass=2,
                    Margin =1,
                    MarginReal =1,
                    Turnover=1,
                    TurnoverReal=1,
                    WinLoss=1,
                    WinLossReal =1
                },
                new TraderPerformanceByCCModel()
                {
                    TraderId = 1,
                    TraderName = "b",
                    BetCount= 1,
                    CustomerClass=2,
                    Margin =-1,
                    MarginReal =-1,
                    Turnover=1,
                    TurnoverReal=1,
                    WinLoss=-1,
                    WinLossReal =-1
                },
                 new TraderPerformanceByCCModel()
                {
                    TraderId = 1,
                    TraderName = "d",
                    BetCount= 1,
                    CustomerClass=1,
                    Margin =-1,
                    MarginReal =-1,
                    Turnover=1,
                    TurnoverReal=1,
                    WinLoss=-1,
                    WinLossReal =-1
                }
            };

            return Json(example, JsonRequestBehavior.AllowGet);
        }
    }
}