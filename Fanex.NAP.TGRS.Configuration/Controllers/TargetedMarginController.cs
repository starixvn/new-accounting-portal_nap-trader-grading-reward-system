namespace Fanex.NAP.TGRS.Configuration.Controllers
{
    using Core.Helpers;
    using Criteria.TargetedMargin;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Configuration.Models.TargetedMargin;
    using Fanex.NAP.TGRS.Configuration.Services.Interface;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using System.Web.Mvc;

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

        public ActionResult GetHostPermission()
        {
            return Json(PermissionService.HasHostPermission(TGRSFunctionKeys.SpreadManagement), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.TargetedMargin, Policy = NAP.Core.Business.Constant.Policy.Host)]
        public ActionResult UpdateMargin(TargetedMargin modifiedMargin)
        {
            var creatorId = AppSession.CurrentUser == null ? AppSession.CurrentUser.Id : 0;
            var marginCriteria = new UpdateTargetedMarginCriteria(creatorId, modifiedMargin);
            var result = _service.UpdateTargetedMargin(marginCriteria);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}