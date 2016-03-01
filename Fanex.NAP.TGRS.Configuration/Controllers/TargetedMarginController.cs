namespace Fanex.NAP.TGRS.Configuration.Controllers
{
    using System.Linq;
    using System.Web.Mvc;
    using Core.Helpers;
    using Criteria.TargetedMargin;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Configuration.Models.TargetedMargin;
    using Fanex.NAP.TGRS.Configuration.Services.Interface;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Services.Utility;
    using ViewModel.TargetedMargin;

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
            var result = _service.GetMargin(new GetAllTargetedMarginCriteria()).Select(g => new TargetedMarginWithAllShift(g));
            return Json(result, JsonRequestBehavior.AllowGet);
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