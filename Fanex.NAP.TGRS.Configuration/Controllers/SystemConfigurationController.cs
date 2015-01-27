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
        [NapAuth(FunctionKey = TGRSFunctionKeys.SystemSetting, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            IEnumerable<BetTypeItem> betTypes = this._detailReportService.GetBetTypes();
            ViewBag.BetTypes = betTypes;
            ViewBag.ScoreCalculationPeriod = this._systemConfigurationService.GetScoreCalculationPeriod(new ScoreCalculationPeriodCriteria())[0];
            return View();
        }

        /// <summary>
        /// Update Grade.
        /// </summary>
        /// <param name="criteria">Criteria that are used to update data.</param>
        /// <returns>JSON object indicates the result of insert.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.SystemSetting, Policy = Constant.Policy.Read)]
        public JsonResult UpdateDefaultBettype(UpdateDefaultBettypeCriteria criteria)
        {
            criteria.IsDefaultBettypes = criteria.IsDefaultBettypes ?? string.Empty;
            ICommandResult result = this._systemConfigurationService.UpdateDefaultBettype(criteria);
            return Json(new
            {
                ErrorCode = result.Code,
                ErrorMessage = result.Message
            });
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.SystemSetting, Policy = Constant.Policy.Read)]
        public JsonResult UpdateScoreCalculationPeriod(UpdateScoreCalculationPeriodCriteria criteria)
        {
            criteria.UserId = this.CurrentSession.UserId;
            ICommandResult updatedResult = this._systemConfigurationService.UpdateScoreCalculationPeriod(criteria);
            return Json(new
            {
                ErrorCode = updatedResult.Code,
                ErrorMessage = updatedResult.Message
            });
        }
    }
}