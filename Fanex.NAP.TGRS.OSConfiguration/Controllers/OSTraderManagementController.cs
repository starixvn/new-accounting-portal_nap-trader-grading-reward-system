using System.Linq;
using System.Threading.Tasks;
using Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement;
using Fanex.NAP.TGRS.OSConfiguration.Services.GradeManagement;
using Fanex.NAP.TGRS.OSConfiguration.Services.Interface;
using Fanex.NAP.TGRS.OSConfiguration.Services.TeamManagement;
using Fanex.NAP.TGRS.OSConfiguration.Services.Utility;

namespace Fanex.NAP.TGRS.OSConfiguration.Controllers
{
    using System.Web.Mvc;
    using Core.BaseClasses;

    public class OSTraderManagementController : TGRSBaseController
    {
        private ITraderManagementService _traderService;

        private ITeamManagementService _teamService;

        private IGradeManagementService _gradeService;

        private IIssueService _issueService;

        public OSTraderManagementController(ITraderManagementService service, ITeamManagementService teamService, IGradeManagementService gradeService, IIssueService issueService)
        {
            _traderService = service;
            _teamService = teamService;
            _gradeService = gradeService;
            _issueService = issueService;
        }

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetTraders()
        {
            var result = _traderService.GetAllTrader();
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> GetTeamName()
        {
            var team = _teamService.GetAllTeam().Select(t => new { TeamName = t.TeamName, TeamId = t.TeamId });
            return Json(team, JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> GetGradeName()
        {
            var grade = _gradeService.GetAllGrade().Select(g => new { GradeName = g.GradeName, GradeId = g.GradeId });
            return Json(grade, JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> GetIssueType()
        {
            var result = _issueService.GetIssueInfos();

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult InsertTrader(InsertTraderCriteria criteria)
        {
            criteria.CreatorId = SessionUtility.GetCreatorId();
            return Json(_traderService.InsertTrader(criteria), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateTrader(UpdateTraderCriteria criteria)
        {
            criteria.CreatorId = SessionUtility.GetCreatorId();
            return Json(_traderService.UpdateTrader(criteria), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTraderTeamHistory(GetTeamHistoryCriteria criteria)
        {
            var result = _traderService.GetTraderTeamHistories(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTraderGradeHistory(GetGradeHistoryCriteria criteria)
        {
            var result = _traderService.GetTraderGradeHistories(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTraderEPADeduction(GetEPADeductionCriteria criteria)
        {
            var result = _traderService.GetTraderEPADeductions(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTraderError(GetErrorCriteria criteria)
        {
            var result = _traderService.GetTraderErrors(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult InsertTraderIssue(InsertIssueCriteria criteria)
        {
            criteria.CreatorId = SessionUtility.GetCreatorId();
            var result = _issueService.InsertNewIssue(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}