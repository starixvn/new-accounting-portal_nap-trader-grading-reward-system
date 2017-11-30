// --------------------------------------------------------------------------
// <copyright file="SystemConfigurationController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.12.04">Created</change>
// </history>
namespace Fanex.NAP.TGRS.Configuration.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Configuration.Criteria.BettypeManagement;
    using Fanex.NAP.TGRS.Configuration.Models.BettypeManagement;
    using Fanex.NAP.TGRS.Configuration.Services.SystemConfiguration;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Newtonsoft.Json.Linq;
    using System.Web.Mvc;

    /// <summary>
    /// Trader controller.
    /// </summary>
    public class BettypeManagementController : TGRSBaseController
    {
        #region Members

        private readonly IBettypeManagement _bettypeManagementService;

        #endregion Members

        #region Constructors

        [Simplect.Attribute.InjectObject]
        public BettypeManagementController(IBettypeManagement bettypeManagementService)
        {
            _bettypeManagementService = bettypeManagementService;
        }

        #endregion Constructors

        /// <summary>
        /// Gets Index page.
        /// </summary>
        /// <returns>Return Index View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.BettypeManagement, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            ViewBag.BettypeColumns = ViewModelHelper.GetColumns<Bettype>();
            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.BettypeManagement, Policy = Constant.Policy.Read)]
        public ActionResult GetAllBettype()
        {
            var bt = _bettypeManagementService.GetBettypes();
            var json = JArray.FromObject(bt);
            return Content(json.ToString(), "application/json");
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.BettypeManagement, Policy = Constant.Policy.Read)]
        public ActionResult InserNewBettype(InsertNewBettypeCriteria criteria)
        {
            criteria.UserId = CurrentSession.UserId;
            return Json(_bettypeManagementService.InsertNewBettype(criteria));
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.BettypeManagement, Policy = Constant.Policy.Read)]
        public ActionResult UpdateBettype(UpdateBettypeCriteria criteria)
        {
            criteria.UserId = CurrentSession.UserId;
            return Json(_bettypeManagementService.UpdateBettype(criteria));
        }
    }
}