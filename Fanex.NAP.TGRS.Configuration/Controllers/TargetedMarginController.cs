namespace Fanex.NAP.TGRS.Configuration.Controllers
{
    using Fanex.NAP.TGRS.Configuration.Services.Interface;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using System.Web.Mvc;
    using Fanex.NAP.TGRS.Configuration.ViewModel.TargetedMargin;
    using Fanex.NAP.Core.Web.Attribute;

    public class TargetedMarginController : TGRSBaseController
    {
        private ITargetedMarginService _service;

        public TargetedMarginController(ITargetedMarginService service)
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
        [NapAuth(FunctionKey = TGRSFunctionKeys.TargetedMargin, Policy = NAP.Core.Business.Constant.Policy.Host)]
        public ActionResult UpdateMargin(TargetedMargin modifiedMargin)
        {
            var result = _service.UpdateMargin(modifiedMargin);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}