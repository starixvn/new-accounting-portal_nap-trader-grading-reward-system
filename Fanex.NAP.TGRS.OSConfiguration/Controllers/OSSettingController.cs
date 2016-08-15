using System.Threading.Tasks;
using Fanex.NAP.TGRS.OSConfiguration.Criteria.SettingManagement;
using Fanex.NAP.TGRS.OSConfiguration.Services.Interface;
using Fanex.NAP.TGRS.OSConfiguration.Services.Utility;

namespace Fanex.NAP.TGRS.OSConfiguration.Controllers
{
    using System.Web.Mvc;
    using Core.BaseClasses;

    public class OSSettingController : TGRSBaseController
    {
        private ISettingService _service;

        public OSSettingController(ISettingService service1)
        {
            _service = service1;
        }

        public ActionResult Index()
        {
            return View();
        }

        public async Task<JsonResult> GetSettings()
        {
            var data = await Task.Run(() => _service.GetSettings());

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateTarget(UpdateTargetCriteria criteria)
        {
            criteria.UserId = SessionUtility.GetCreatorId();
            return Json(_service.UpdateTarget(criteria), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AddSetting(AddSettingCriteria criteria)
        {
            criteria.UserId = SessionUtility.GetCreatorId();
            return Json(_service.AddSetting(criteria), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteSetting(DeleteSettingCriteria criteria)
        {
            criteria.UserId = SessionUtility.GetCreatorId();
            return Json(_service.DeleteSetting(criteria), JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> GetSports()
        {
            var data = await Task.Run(() => _service.GetSports());
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLeagues(GetLeagueCriteria criteria)
        {
            return Json(_service.GetLeagues(criteria), JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> GetBettypes()
        {
            var result = await Task.Run(() => _service.GetBettypes());

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> GetParameters()
        {
            var result = await Task.Run(() => new
            {
                Global = _service.GetGlobalParameter(),
                Other = _service.GetParameters()
            });

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateParameters(UpdateParameterCriteria criteria)
        {
            criteria.UserId = SessionUtility.GetCreatorId();
            return Json(_service.UpdateParamters(criteria), JsonRequestBehavior.AllowGet);
        }
    }
}