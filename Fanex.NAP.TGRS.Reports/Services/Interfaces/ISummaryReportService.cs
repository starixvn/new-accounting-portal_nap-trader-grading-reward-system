// -----------------------------------------------------------------------
// <copyright file="ISummaryReportService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.26">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Services.Interface.SummaryReport
{
    using System.Collections.Generic;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;

    public interface ISummaryReportService
    {
        IEnumerable<GeneralInfo> GetGeneralInfo(GeneralInfoCriteria criteria);

        IEnumerable<TeamPerformance> GetTeamPerformance(TeamPerformanceCriteria criteria);
    }
}
