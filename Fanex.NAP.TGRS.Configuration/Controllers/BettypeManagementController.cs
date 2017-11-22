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
    using System.Collections.Generic;
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Configuration.Services.SystemConfiguration;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Reports.Services;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;
    using Newtonsoft.Json.Linq;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Configuration.Models.BettypeManagement;

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

        [NapAuth(FunctionKey = TGRSFunctionKeys.BettypeManagement, Policy = Constant.Policy.Read)]
        public ActionResult GetAllBettype()
        {
            var bt = _bettypeManagementService.GetBettypes();
            var json = JArray.FromObject(bt);
            return Content(json.ToString(), "application/json");
        }
    }
}