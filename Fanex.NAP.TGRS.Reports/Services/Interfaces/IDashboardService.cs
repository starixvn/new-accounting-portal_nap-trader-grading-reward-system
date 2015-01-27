// -----------------------------------------------------------------------
// <copyright file="IDashboardService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.26">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Services
{
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.ViewModels.Dashboard;

    public interface IDashboardService
    {
        IEnumerable<GeneralInfo> GetGeneralInfo(int month);

        IEnumerable<League> GetTopWinLeague(int month);

        IEnumerable<TopTrader> GetTopTrader(int month);

        IEnumerable<BetTypePerformance> GetTopBettype(int month);

        IEnumerable<MonthAmountItem> GetSummaryData(int month);

        IEnumerable<TeamPerformance> GetTeamData(int month);
    }
}
