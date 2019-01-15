namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.Criteria.BettypeMonthlyPerformance;
    using Fanex.NAP.TGRS.Reports.Services;
    using Fanex.NAP.TGRS.Reports.Services.Implements;
    using Fanex.NAP.TGRS.Reports.Services.Interfaces;
    using System;
    using System.Linq;
    using System.Web.Mvc;

    [NapAuth(FunctionKey = TGRSFunctionKeys.BettypeMonthlyPerformance, Policy = NAP.Core.Business.Constant.Policy.Read)]
    public class BettypeMonthlyPerformanceController : TGRSBaseController
    {
        private readonly IDetailReportService _detailReportService = new DetailReportService();

        private readonly IBettypeMonthlyReport _bettypeSerive = new BettypeMonthlyService();

        public ActionResult Index()
        {
            return View(_detailReportService.GetBetTypesFromSession(CurrentSession.UserId));
        }

        public ActionResult GenerateData(string bettypes, int year)
        {
            var criteria = new BettypeMonthlyGetCriteria
            {
                Bettypes = bettypes,
                Year = year,
                IsExcludeLeagues = AppSession.IsExcludingLeagues
            };

            return Json(_bettypeSerive.GenerateData(criteria), JsonRequestBehavior.AllowGet);
        }

        public ActionResult GenerateExcel(string bettypes, int year, string columns)
        {
            var critieria = new BettypeMonthlyGetCriteria
            {
                Bettypes = bettypes,
                Year = year,
                IsExcludeLeagues = AppSession.IsExcludingLeagues
            };

            var parsedColumns = columns.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).ToArray();

            var template = Server.MapPath("~/Areas/Reports/ExcelTemplates/BettypeMonthlyPerformance/MonthlyPerformance.xlsx");

            var fileName = $"Bettype_Monthly_Performance_{DateTime.Now.ToShortFormatedDateForFileName()}.xlsx";

            var file = _bettypeSerive.GenerateExcel(critieria, parsedColumns, template);

            return File(file, "application/vnd.ms-excel", fileName);
        }
    }
}