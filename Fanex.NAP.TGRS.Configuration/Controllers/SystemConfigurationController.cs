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
    using Fanex.NAP.TGRS.Configuration.Criteria.SystemConfiguration;
    using Fanex.NAP.TGRS.Configuration.Services.SystemConfiguration;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Reports.Services;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;

    /// <summary>
    /// Trader controller.
    /// </summary>
    public class SystemConfigurationController : TGRSBaseController
    {
        #region Members

        private readonly ISystemConfigurationService _systemConfigurationService;
        private readonly IDetailReportService _detailReportService;

        #endregion Members

        #region Constructors

        public SystemConfigurationController()
            : this(null, null)
        {
        }

        public SystemConfigurationController(ISystemConfigurationService systemConfigurationService, IDetailReportService detailReportService)
        {
            this._systemConfigurationService = systemConfigurationService ?? new SystemConfigurationService();
            this._detailReportService = detailReportService ?? new DetailReportService();
        }

        #endregion Constructors

        /// <summary>
        /// Gets Index page.
        /// </summary>
        /// <returns>Return Index View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.SystemConfiguration, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            IEnumerable<BetTypeItem> betTypes = this._detailReportService.GetBetTypes();
            ViewBag.BetTypes = betTypes;

            return View();
        }

        /// <summary>
        /// Update Grade.
        /// </summary>
        /// <param name="criteria">Criteria that are used to update data.</param>
        /// <returns>JSON object indicates the result of insert.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.SystemConfiguration, Policy = Constant.Policy.Read)]
        public JsonResult UpdateDefaultBettype(UpdateDefaultBettypeCriteria criteria)
        {
            criteria.BetTypes = criteria.BetTypes ?? string.Empty;

            this._systemConfigurationService.UpdateDefaultBettype(criteria);

            return Json(new
            {
                ErrorCode = 0,
                ErrorMessage = string.Empty
            });
        }
    }
}