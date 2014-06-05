// -----------------------------------------------------------------------
// <copyright file="Reports.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceSummary
{
    using System.Collections.Generic;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;

    /// <summary>
    /// Performance summary reports.
    /// </summary>
    public class Reports
    {
        public GeneralInfo GeneralInfo { get; set; }

        public IEnumerable<TeamPerformance> TeamPerformances { get; set; }

        public TraderPerformance TraderPerformance { get; set; }

        public IEnumerable<BetTypePerformance> BetTypePerformances { get; set; }

        public IEnumerable<League> WinLeagues { get; set; }

        public IEnumerable<League> LoseLeagues { get; set; }
    }
}
