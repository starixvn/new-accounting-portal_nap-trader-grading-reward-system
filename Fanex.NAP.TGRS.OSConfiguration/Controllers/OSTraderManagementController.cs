namespace Fanex.NAP.TGRS.OSConfiguration.Controllers
{
    using Core.BaseClasses;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Services.TraderManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Services.GradeManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Services.TeamManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Services.Utility;
    using System.Linq;
    using System.Web.Mvc;

    public class OSTraderManagementController : TGRSBaseController
    {
        private ITraderManagementService _traderService;

        private ITeamManagementService _teamService;

        private IGradeManagementService _gradeService;

        public OSTraderManagementController(
            ITraderManagementService service,
            ITeamManagementService teamService,
            IGradeManagementService gradeService)
        {
            _traderService = service;
            _teamService = teamService;
            _gradeService = gradeService;
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderManagement, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            ViewBag.HasEditRight = this.HasRight(TGRSFunctionKeys.OSTraderManagement, Constant.Policy.Host);
            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetTraders()
        {
            var result = _traderService.GetAllTrader();
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetTeamName()
        {
            var team = _teamService.GetAllTeam().Select(t => new { TeamName = t.TeamName, TeamId = t.TeamId });
            return Json(team, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetGradeName()
        {
            var grade = _gradeService.GetAllGrade().Select(g => new { GradeName = g.GradeName, GradeId = g.GradeId });
            return Json(grade, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderManagement, Policy = Constant.Policy.Host)]
        public JsonResult InsertTrader(InsertTraderCriteria criteria)
        {
            criteria.CreatorId = SessionUtility.GetCreatorId();
            return Json(_traderService.InsertTrader(criteria), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderManagement, Policy = Constant.Policy.Host)]
        public JsonResult UpdateTrader(UpdateTraderCriteria criteria)
        {
            criteria.CreatorId = SessionUtility.GetCreatorId();
            return Json(_traderService.UpdateTrader(criteria), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderByNameTeamGrade(GetTraderCriteria criteria)
        {
            var result = _traderService.GetTraderByNameTeamGrade(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderTeamHistory(GetTeamHistoryCriteria criteria)
        {
            var result = _traderService.GetTraderTeamHistories(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTraderManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetTraderGradeHistory(GetGradeHistoryCriteria criteria)
        {
            var result = _traderService.GetTraderGradeHistories(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}