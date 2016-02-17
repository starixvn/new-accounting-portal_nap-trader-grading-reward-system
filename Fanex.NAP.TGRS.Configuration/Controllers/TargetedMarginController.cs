namespace Fanex.NAP.TGRS.Configuration.Controllers
{
    using System.Web.Mvc;
    using Core.Helpers;
    using Criteria.TargetedMargin;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Configuration.Models.TargetedMargin;
    using Fanex.NAP.TGRS.Configuration.Services.Interface;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Services.Utility;

    public class TargetedMarginController : TGRSBaseController
    {
        private ITargetedMarginService _service;

        public TargetedMarginController(ITargetedMarginService service)
        {
            _service = service;
        }

        private bool HasHostPermission
        {
            get
            {
                return PermissionService.HasHostPermission(TGRSFunctionKeys.TargetedMargin);
            }
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetAllMargin()
        {
            var getAllCriteria = new GetAllTargetedMarginCriteria();
            return Json(_service.GetMargin(getAllCriteria), JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetHostPermission()
        {
            return Json(HasHostPermission, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.TargetedMargin, Policy = NAP.Core.Business.Constant.Policy.Host)]
        public ActionResult UpdateMargin(TargetedMargin modifiedMargin)
        {
            var creatorId = SessionUtility.GetCreatorId();
            var marginCriteria = new UpdateTargetedMarginCriteria(creatorId, modifiedMargin);
            var result = _service.UpdateTargetedMargin(marginCriteria);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}