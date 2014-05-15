// --------------------------------------------------------------------------
// <copyright file="BenchmarkManagementController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Controllers
{
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Configuration.Services.BenchmarkManagement;
    using Fanex.NAP.TGRS.Core.BaseClasses;

    /// <summary>
    /// Team controller.
    /// </summary>
    public class BenchmarkManagementController : TGRSBaseController
    {
        private IBenchmarkManagementService _benchmarkService;

        public BenchmarkManagementController()
            : this(null)
        {
        }

        public BenchmarkManagementController(IBenchmarkManagementService benchmarkService)
        {
            this._benchmarkService = benchmarkService ?? new BenchmarkManagementService();
            ViewBag.HasEditRight = this.HasRight(TGRSFunctionKeys.BenchmarkManagement, Constant.Policy.Host);
        }

        /// <summary>
        /// Gets Index page.
        /// </summary>
        /// <returns>Return Index View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.BenchmarkManagement, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View();
        }
    }
}