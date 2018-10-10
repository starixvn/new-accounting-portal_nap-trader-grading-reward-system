// -----------------------------------------------------------------------
// <copyright file="GetTeamPerformanceCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.26">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceSummary
{
    using System;
    using Fanex.Data.Repository;

    /// <summary>
    /// Get team performance.
    /// </summary>
    public class GetTeamPerformanceCriteria : BettypeGroupCriteria
    {
        public int ReportType { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        /// <summary>
        /// Gets Setting Key.
        /// </summary>
        /// <returns>Setting key of the criteria.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_Rpt_SummaryTeamPerformance";
        }

        /// <summary>
        /// Checks validation of the criteria.
        /// </summary>
        /// <returns>Whether or not the criteria is valid.</returns>
        public override bool IsValid()
        {
            return true;
        }
    }
}
