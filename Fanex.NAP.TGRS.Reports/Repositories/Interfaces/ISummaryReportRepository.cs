// -----------------------------------------------------------------------
// <copyright file="ISummaryReportRepository.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.29">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Repositories.Interface
{
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceSummary;

    public interface ISummaryReportRepository
    {
        TraderPerformance GetTraderPerformance(GetTraderPerformanceCriteria criteria);

        TeamHistory GetTeamHistory(GetTeamHistoryCriteria criteria);

        GradeHistory GetGradeHistory(GetGradeHistoryCriteria criteria);
    }
}
