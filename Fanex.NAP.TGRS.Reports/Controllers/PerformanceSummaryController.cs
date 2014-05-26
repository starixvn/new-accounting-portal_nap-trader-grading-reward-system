// --------------------------------------------------------------------------
// <copyright file="PerformanceSummaryController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.19">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Services.Implement.SummaryReport;
    using Fanex.NAP.TGRS.Reports.Services.Interface.SummaryReport;

    /// <summary>
    /// Performance summary report controller.
    /// </summary>
    public class PerformanceSummaryController : TGRSBaseController
    {
        private readonly ISummaryReportService _summaryReportService;

        public PerformanceSummaryController()
            : this(null)
        {
        }

        public PerformanceSummaryController(ISummaryReportService summaryReportService)
        {
            this._summaryReportService = summaryReportService ?? new SummaryReportService();
        }

        /// <summary>
        /// Gets Index page.
        /// </summary>
        /// <returns>Return Index View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Get Summary Info.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>List of JSON objects.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public JsonResult GetGeneralInfo(GeneralInfoCriteria criteria)
        {
            GeneralInfo result = this._summaryReportService.GetGeneralInfo(criteria).First();

            return Json(result);
        }

        /// <summary>
        /// Get Team Performance.
        /// </summary>
        /// <param name="criteria">Criteria that are used to query data.</param>
        /// <returns>List of JSON objects.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.PerformanceSummary, Policy = Constant.Policy.Read)]
        public JsonResult GetTeamPerformance(TeamPerformanceCriteria criteria)
        {
            IEnumerable<TeamPerformance> result = this._summaryReportService.GetTeamPerformance(criteria);

            return Json(result);
        }
    }
}