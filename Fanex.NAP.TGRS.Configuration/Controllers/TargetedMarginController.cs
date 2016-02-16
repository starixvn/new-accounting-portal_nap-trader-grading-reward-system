using Fanex.NAP.TGRS.Configuration.Services.Interface;
using Fanex.NAP.TGRS.Core.BaseClasses;
using System.Web.Mvc;
using Fanex.NAP.TGRS.Configuration.ViewModel.ProfitMargin;

namespace Fanex.NAP.TGRS.Configuration.Controllers
{
    public class TargetedMarginController : TGRSBaseController
    {
        private IMarginService _service;

        public TargetedMarginController(IMarginService service)
        {
            _service = service;
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetAllMargin()
        {
            return Json(_service.GetMargin(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult UpdateMargin(TargetedMargin modifiedMargin)
        {
            var result = _service.UpdateMargin(modifiedMargin);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}