// --------------------------------------------------------------------------
// <copyright file="TraderManagementController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.14">Created</change>
// </history>
namespace Fanex.NAP.TGRS.Configuration.Controllers
{
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Configuration.Criteria.TeamManagement;
    using Fanex.NAP.TGRS.Configuration.Criteria.TraderManagement;
    using Fanex.NAP.TGRS.Configuration.Services.TeamManagement;
    using Fanex.NAP.TGRS.Configuration.Services.TraderManagement;
    using Fanex.NAP.TGRS.Configuration.ViewModel.TeamManagement;
    using Fanex.NAP.TGRS.Configuration.ViewModel.TraderManagement;
    using Fanex.NAP.TGRS.Core.BaseClasses;

    /// <summary>
    /// Trader controller.
    /// </summary>
    public class TraderManagementController : TGRSBaseController
    {
        #region Members

        private readonly ITraderManagementService _traderService;
        private readonly ITeamManagementService _teamService;

        #endregion Members

        #region Constructors

        [Simplect.Attribute.InjectObject]
        public TraderManagementController()
            : this(null, null)
        {
        }

        public TraderManagementController(ITraderManagementService traderService, ITeamManagementService teamService)
        {
            this._traderService = traderService ?? new TraderManagementService();
            this._teamService = teamService ?? new TeamManagementService();
        }

        #endregion Constructors

        /// <summary>
        /// Gets Index page.
        /// </summary>
        /// <returns>Return Index View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.TraderManagement, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            ViewBag.HasEditRight = this.HasRight(TGRSFunctionKeys.TraderManagement, Constant.Policy.Host);
            return View();
        }

        /// <summary>
        /// Get all Traders.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>List of JSON objects.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.TraderManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetAllTrader(GetAllTradersCriteria criteria)
        {
            criteria.UserName = criteria.UserName ?? string.Empty;
            criteria.EmployeeId = criteria.EmployeeId ?? string.Empty;

            TraderInfoList result = this._traderService.GetAllTrader(criteria);

            return Json(result);
        }

        /// <summary>
        /// Get team history of trader.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>List of JSON objects.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.TraderManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetTeamHistory(GetTeamHistoryCriteria criteria)
        {
            IEnumerable<TeamHistoryItem> result = this._traderService.GetTeamHistory(criteria);

            return Json(result);
        }

        /// <summary>
        /// Get grade history of trader.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>List of JSON objects.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.TraderManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetGradeHistory(GetGradeHistoryCriteria criteria)
        {
            IEnumerable<GradeHistoryItem> result = this._traderService.GetGradeHistory(criteria);

            return Json(result);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.TraderManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetShiftHistory(GetShiftHistoryCriteria criteria)
        {
            var result = this._traderService.GetShiftHistory(criteria);

            return Json(result);
        }

        /// <summary>
        /// Gets initialized data for index page.
        /// </summary>
        /// <returns>List of JSON objects represents the team list and grade list.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.TraderManagement, Policy = Constant.Policy.Read)]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Reviewed. Suppression is OK here.")]
        public JsonResult GetInitializedData()
        {
            TeamInfoList teams = this._teamService.GetTeamSelectList(new GetTeamSelectListCriteria());
            var shifts = _traderService.GetShifts();

            return Json(new
            {
                Teams = teams,
                Shifts = shifts
            });
        }

        /// <summary>
        /// Add new Trader.
        /// </summary>
        /// <param name="insertCriteria">Criteria that are used to insert data.</param>
        /// <param name="getCriteria">Criteria that are used to get data.</param>
        /// <returns>JSON object indicates the result of insert.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.TraderManagement, Policy = Constant.Policy.Read)]
        public JsonResult InsertTrader(InsertTraderCriteria insertCriteria, GetAllTradersCriteria getCriteria)
        {
            ICommandResult result = null;
            TraderInfoList updatedItems = null;

            insertCriteria.Username = insertCriteria.Username ?? string.Empty;
            insertCriteria.EmployeeId = insertCriteria.EmployeeId ?? string.Empty;
            insertCriteria.UserId = this.CurrentSession.UserId;
            insertCriteria.Remark = insertCriteria.Remark ?? string.Empty;

            result = this._traderService.InsertTrader(insertCriteria);

            if (result.IsSuccessful)
            {
                getCriteria.EmployeeId = getCriteria.EmployeeId ?? string.Empty;
                getCriteria.UserName = getCriteria.UserName ?? string.Empty;
                updatedItems = this._traderService.GetAllTrader(getCriteria);
            }

            return Json(new
            {
                ErrorCode = result.Code,
                ErrorMessage = result.Message,
                UpdatedItems = updatedItems
            });
        }

        /// <summary>
        /// Update Trader.
        /// </summary>
        /// <param name="updateCriteria">Criteria that are used to update data.</param>
        /// <param name="getCriteria">Criteria that are used to get data.</param>
        /// <returns>JSON object indicates the result of insert.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.TraderManagement, Policy = Constant.Policy.Read)]
        public JsonResult UpdateTrader(UpdateTraderCriteria updateCriteria, GetAllTradersCriteria getCriteria)
        {
            ICommandResult result = null;
            TraderInfoList updatedItems = null;

            updateCriteria.UserId = this.CurrentSession.UserId;
            updateCriteria.NewRemark = updateCriteria.NewRemark;

            result = this._traderService.UpdateTrader(updateCriteria);

            if (result.IsSuccessful)
            {
                getCriteria.EmployeeId = getCriteria.EmployeeId ?? string.Empty;
                getCriteria.UserName = getCriteria.UserName ?? string.Empty;
                updatedItems = this._traderService.GetAllTrader(getCriteria);
            }

            return Json(new
            {
                ErrorCode = result.Code,
                ErrorMessage = result.Message,
                UpdatedItems = updatedItems
            });
        }
    }
}