namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Reports.Services;
    using Fanex.NAP.TGRS.Reports.Services.Implements;
    using Fanex.NAP.TGRS.Reports.Services.Interfaces;
    using System;
    using System.Linq;
    using System.Web.Mvc;

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
            return Json(_bettypeSerive.GenerateData(bettypes, year), JsonRequestBehavior.AllowGet);
        }

        public ActionResult GenerateExcel(string bettypes, int year, string columns)
        {
            var parsedColumns = columns.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).ToArray();

            var template = Server.MapPath("~/Areas/Reports/ExcelTemplates/BettypeMonthlyPerformance/MonthlyPerformance.xlsx");

            var fileName = $"Bettype_Monthly_Performance_{DateTime.Now.ToShortFormatedDateForFileName()}.xlsx";

            var file = _bettypeSerive.GenerateExcel(bettypes, year, parsedColumns, template);

            return File(file, "application/vnd.ms-excel", fileName);
        }
    }
}