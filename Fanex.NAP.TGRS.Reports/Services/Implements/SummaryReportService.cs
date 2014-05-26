// -----------------------------------------------------------------------
// <copyright file="SummaryReportService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// <history>
//   <change who="Ken.Nguyen" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Services.Implement.SummaryReport
{
    using System.Collections.Generic;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Services.Interface.SummaryReport;

    /// <summary>
    /// Trader Management Service.
    /// </summary>
    public class SummaryReportService : TGRSBaseService, ISummaryReportService
    {
        public IEnumerable<GeneralInfo> GetGeneralInfo(GeneralInfoCriteria criteria)
        {
            IEnumerable<GeneralInfo> result = null;

            result = this.GetData<GeneralInfo>(criteria);

            return result;
        }

        public IEnumerable<TeamPerformance> GetTeamPerformance(TeamPerformanceCriteria criteria)
        {
            IEnumerable<TeamPerformance> result = null;

            result = this.GetData<TeamPerformance>(criteria);

            return result;
        }
    }
}
