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
    using Fanex.NAP.Core.Service.Impl;
    using Fanex.NAP.Core.Service.Interface;
    using Fanex.NAP.TGRS.Core.BaseClasses;

    /// <summary>
    /// Team controller.
    /// </summary>
    public class TeamManagementController : TGRSBaseController
    {
        #region Members

        private IUserService _userService;

        #endregion Members

        #region Constructors

        public TeamManagementController()
            : this(null)
        {
        }

        public TeamManagementController(IUserService userService)
        {
            this._userService = userService ?? new UserService();
        }

        #endregion Constructors

        /// <summary>
        /// Gets Index page.
        /// </summary>
        /// <returns>Return Index View.</returns>
        public ActionResult Index()
        {
            return View();
        }
    }
}