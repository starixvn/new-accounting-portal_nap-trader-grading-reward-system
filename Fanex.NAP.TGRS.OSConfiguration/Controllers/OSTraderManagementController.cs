using Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement;
using Fanex.NAP.TGRS.OSConfiguration.Models.TraderManagement;

namespace Fanex.NAP.TGRS.OSConfiguration.Controllers
{
    using System.Web.Mvc;
    using Core.BaseClasses;

    public class OSTraderManagementController : TGRSBaseController
    {
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetTraders(GetTraderCriteria criteria)
        {
            var test = new[]
            {
                new Trader(),
                new Trader()
            };
            return Json(test, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTraderTeamHistory(GetTeamHistoryCriteria criteria)
        {
            var test = new[]
            {
                new History(),
                new History(),
            };
            return Json(test, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTraderGradeHistory(GetGradeHistoryCriteria criteria)
        {
            var test = new[]
            {
                new History(),
                new History(),
            };
            return Json(test, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTraderEPADeduction(GetEPADeductionCriteria criteria)
        {
            var test = new[]
            {
                new Error(),
                new Error(),
            };

            return Json(test, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTraderError(GetErrorCriteria criteria)
        {
            var test = new[]
            {
                new Error(),
                new Error(),
            };

            return Json(test, JsonRequestBehavior.AllowGet);
        }
    }
}