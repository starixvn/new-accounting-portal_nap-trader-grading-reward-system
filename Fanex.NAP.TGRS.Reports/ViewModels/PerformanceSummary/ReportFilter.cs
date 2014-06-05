// -----------------------------------------------------------------------
// <copyright file="ReportFilter.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceSummary
{
    using System;

    /// <summary>
    /// Performance summary report filter.
    /// </summary>
    public class ReportFilter
    {
        public int ReportType { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }
    }
}
