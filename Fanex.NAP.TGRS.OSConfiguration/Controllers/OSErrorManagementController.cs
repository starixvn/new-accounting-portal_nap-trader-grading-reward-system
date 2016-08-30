using System.Web.Mvc;
using Fanex.NAP.Core.Business;
using Fanex.NAP.Core.Web.Attribute;
using Fanex.NAP.TGRS.Core.BaseClasses;
using Fanex.NAP.TGRS.OSConfiguration.Criteria.ErrorManagement;
using Fanex.NAP.TGRS.OSConfiguration.Services.Interface;
using Fanex.NAP.TGRS.OSConfiguration.Services.Utility;

namespace Fanex.NAP.TGRS.OSConfiguration.Controllers
{
    public class OSErrorManagementController : TGRSBaseController
    {
        private IErrorService _service;

        public OSErrorManagementController(IErrorService service)
        {
            _service = service;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSErrorManagement, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            ViewBag.HasEditRight = this.HasRight(TGRSFunctionKeys.OSErrorManagement, Constant.Policy.Host);
            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSErrorManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetAllErrors()
        {
            var result = _service.GetAllErrors();

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.OSErrorManagement, Policy = Constant.Policy.Host)]
        public JsonResult InsertError(InsertErrorCriteria criteria)
        {
            criteria.UserId = SessionUtility.GetCreatorId();
            var result = _service.InsertError(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.OSErrorManagement, Policy = Constant.Policy.Host)]
        public JsonResult UpdateError(UpdateErrorCriteria criteria)
        {
            criteria.UserId = SessionUtility.GetCreatorId();
            var result = _service.UpdateError(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.OSErrorManagement, Policy = Constant.Policy.Host)]
        public JsonResult UpdateErrorStatus(UpdateErrStatusCriteria criteria)
        {
            criteria.UserId = SessionUtility.GetCreatorId();
            var result = _service.UpdateErrorStatus(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.OSErrorManagement, Policy = Constant.Policy.Host)]
        public JsonResult DeleteError(DeleteErrorCriteria criteria)
        {
            criteria.UserId = SessionUtility.GetCreatorId();
            var result = _service.DeleteError(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}