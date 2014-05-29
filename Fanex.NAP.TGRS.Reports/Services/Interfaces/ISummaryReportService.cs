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
        IEnumerable<GeneralInfo> GetGeneralInfo(GetGeneralInfoCriteria criteria);

        IEnumerable<TeamPerformance> GetTeamPerformance(GetTeamPerformanceCriteria criteria);

        IEnumerable<League> GetTopLoseLeague(GetTopLoseLeagueCriteria criteria);

        IEnumerable<TopTrader> GetTopTrader(GetTopTraderCriteria criteria);

        IEnumerable<League> GetTopWinLeague(GetTopWinLeagueCriteria criteria);

        TraderPerformance GetTraderPerformance(GetTraderPerformanceCriteria criteria);

        IEnumerable<BetTypePerformance> GetBetTypePerformance(GetBetTypePerformanceCriteria criteria);
    }
}
