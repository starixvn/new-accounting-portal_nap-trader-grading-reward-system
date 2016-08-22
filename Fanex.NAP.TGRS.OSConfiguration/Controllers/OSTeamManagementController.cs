// --------------------------------------------------------------------------
// <copyright file="TeamManagementController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016.7.29">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSConfiguration.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.TeamManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Services.TeamManagement;
    using System.Web.Mvc;

    public class OSTeamManagementController : TGRSBaseController
    {
        private readonly ITeamManagementService _teamService;

        [Simplect.Attribute.InjectObject]
        public OSTeamManagementController()
            : this(null)
        {
        }

        public OSTeamManagementController(ITeamManagementService teamService)
        {
            this._teamService = teamService ?? new TeamManagementService();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTeamManagement, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            ViewBag.HasEditRight = this.HasRight(TGRSFunctionKeys.OSTeamManagement, Constant.Policy.Host);
            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTeamManagement, Policy = Constant.Policy.Read)]
        [HttpGet]
        public JsonResult GetAllTeam()
        {
            var result = _teamService.GetAllTeam();

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTeamManagement, Policy = Constant.Policy.Host)]
        [HttpPost]
        public JsonResult InsertTeam(InsertTeamCriteria criteria)
        {
            criteria.TeamName = criteria.TeamName ?? string.Empty;
            criteria.UserId = this.CurrentSession.UserId;

            var result = this._teamService.InsertTeam(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.OSTeamManagement, Policy = Constant.Policy.Host)]
        public JsonResult UpdateTeam(UpdateTeamCriteria criteria)
        {
            criteria.TeamName = criteria.TeamName ?? string.Empty;
            criteria.UserId = this.CurrentSession.UserId;

            var result = this._teamService.UpdateTeam(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}