using Fanex.NAP.TGRS.Configuration.Services.Interface;
using Fanex.NAP.TGRS.Core.BaseClasses;
using System.Web.Mvc;

namespace Fanex.NAP.TGRS.Configuration.Controllers
{
    public class TargetedMarginController : TGRSBaseController
    {
        private IProfitMarginService _service;

        public TargetedMarginController(IProfitMarginService service)
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
    }
}