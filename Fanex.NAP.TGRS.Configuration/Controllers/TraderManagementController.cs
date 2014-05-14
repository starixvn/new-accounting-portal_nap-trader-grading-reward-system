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
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Configuration.Criteria.TraderManagement;
    using Fanex.NAP.TGRS.Configuration.Services.Implement.TraderManagement;
    using Fanex.NAP.TGRS.Configuration.Services.Interface.TraderManagement;
    using Fanex.NAP.TGRS.Configuration.ViewModel.TraderManagement;
    using Fanex.NAP.TGRS.Core.BaseClasses;

    /// <summary>
    /// Trader controller.
    /// </summary>
    public class TraderManagementController : TGRSBaseController
    {
        #region Members

        private readonly ITraderManagementService _traderService;

        #endregion Members

        #region Constructors

        public TraderManagementController()
            : this(null)
        {
        }

        public TraderManagementController(ITraderManagementService traderService)
        {
            this._traderService = traderService ?? new TraderManagementService();
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
        /// <returns>List of JSON objects.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.TraderManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetAllTrader()
        {
            TraderInfoList result = this._traderService.GetAllTrader(new GetAllTradersCriteria());

            return Json(result);
        }

        /// <summary>
        /// Add new Trader.
        /// </summary>
        /// <param name="criteria">Criteria that are used to insert data.</param>
        /// <returns>JSON object indicates the result of insert.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.TraderManagement, Policy = Constant.Policy.Read)]
        public JsonResult InsertTrader(InsertTraderCriteria criteria)
        {
            ICommandResult result = null;
            TraderInfoList updatedItems = null;

            criteria.TraderName = criteria.TraderName ?? string.Empty;
            criteria.Description = criteria.Description ?? string.Empty;
            criteria.UserId = this.CurrentSession.UserId;
            result = this._traderService.InsertTrader(criteria);

            if (result.IsSuccessful)
            {
                updatedItems = this._traderService.GetAllTrader(new GetAllTradersCriteria());
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
        /// <param name="criteria">Criteria that are used to update data.</param>
        /// <returns>JSON object indicates the result of insert.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.TraderManagement, Policy = Constant.Policy.Read)]
        public JsonResult UpdateTrader(UpdateTraderCriteria criteria)
        {
            ICommandResult result = null;
            TraderInfoList updatedItems = null;

            criteria.TraderName = criteria.TraderName ?? string.Empty;
            criteria.Description = criteria.Description ?? string.Empty;
            criteria.UserId = this.CurrentSession.UserId;
            result = this._traderService.UpdateTrader(criteria);

            if (result.IsSuccessful)
            {
                updatedItems = this._traderService.GetAllTrader(new GetAllTradersCriteria());
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