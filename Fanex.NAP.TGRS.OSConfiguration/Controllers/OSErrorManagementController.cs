using System.Web.Mvc;
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

        public ActionResult Index()
        {
            return View();
        }


        public JsonResult GetAllErrors()
        {
            var result = _service.GetAllErrors();

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult InsertError(InsertErrorCriteria criteria)
        {
            criteria.UserId = SessionUtility.GetCreatorId();
            var result = _service.InsertError(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateError(UpdateErrorCriteria criteria)
        {
            criteria.UserId = SessionUtility.GetCreatorId();
            var result = _service.UpdateError(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateErrorStatus(UpdateErrStatusCriteria criteria)
        {
            criteria.UserId = SessionUtility.GetCreatorId();
            var result = _service.UpdateErrorStatus(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteError(DeleteErrorCriteria criteria)
        {
            criteria.UserId = SessionUtility.GetCreatorId();
            var result = _service.DeleteError(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}