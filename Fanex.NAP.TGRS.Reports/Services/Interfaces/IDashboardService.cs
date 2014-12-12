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
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Need Review.")]
        IEnumerable<GeneralInfo> GetGeneralInfo();

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Need Review.")]
        IEnumerable<League> GetTopWinLeague();

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Need Review.")]
        IEnumerable<TopTrader> GetTopTrader();

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Need Review.")]
        IEnumerable<BetTypePerformance> GetTopBettype();

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Need Review.")]
        IEnumerable<MonthAmountItem> GetSummaryData();

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Need Review.")]
        IEnumerable<TeamPerformance> GetTeamData(int month);
    }
}
