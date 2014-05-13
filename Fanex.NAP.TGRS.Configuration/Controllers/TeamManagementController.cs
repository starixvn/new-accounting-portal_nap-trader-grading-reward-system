// --------------------------------------------------------------------------
// <copyright file="TeamManagementController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.9">Created</change>
// </history>
namespace Fanex.NAP.TGRS.Configuration.Controllers
{
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Configuration.Criteria.TeamManagement;
    using Fanex.NAP.TGRS.Configuration.Services.Implement.TeamManagement;
    using Fanex.NAP.TGRS.Configuration.Services.Interface.TeamManagement;
    using Fanex.NAP.TGRS.Configuration.ViewModel.TeamManagement;
    using Fanex.NAP.TGRS.Core.BaseClasses;

    /// <summary>
    /// Team controller.
    /// </summary>
    public class TeamManagementController : TGRSBaseController
    {
        #region Members

        private ITeamManagementService _teamService;

        #endregion Members

        #region Constructors

        public TeamManagementController()
            : this(null)
        {
        }

        public TeamManagementController(ITeamManagementService teamManagementService)
        {
            this._teamService = _teamService ?? new TeamManagementService();
        }

        #endregion Constructors

        /// <summary>
        /// Gets Index page.
        /// </summary>
        /// <returns>Return Index View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.TeamManagement, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            ViewBag.HasEditRight = this.HasRight(TGRSFunctionKeys.TeamManagement, Constant.Policy.Host);
            return View();
        }

        /// <summary>
        /// Get all teams.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>List of JSON objects.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.TeamManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetAllTeam(GetAllTeamsCriteria criteria)
        {
            TeamInfoList result = this._teamService.GetAllTeam(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Add new team.
        /// </summary>
        /// <param name="criteria">Criteria that are used to insert data.</param>
        /// <returns>JSON object indicates the result of insert.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.TeamManagement, Policy = Constant.Policy.Read)]
        public JsonResult InsertTeam(InsertTeamCriteria criteria)
        {
            ICommandResult result = this._teamService.InsertTeam(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Update team.
        /// </summary>
        /// <param name="criteria">Criteria that are used to update data.</param>
        /// <returns>JSON object indicates the result of insert.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.TeamManagement, Policy = Constant.Policy.Read)]
        public JsonResult UpdateTeam(UpdateTeamCriteria criteria)
        {
            ICommandResult result = this._teamService.UpdateTeam(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}