// -----------------------------------------------------------------------
// <copyright file="GetGradeHistoryCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.28">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceSummary
{
    using System;
    using Fanex.Data.Repository;

    /// <summary>
    /// Get grade history.
    /// </summary>
    public class GetGradeHistoryCriteria : CriteriaBase
    {
        public int CustId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public short TeamId { get; set; }

        public int LeagueId { get; set; }

        public string Bettypes { get; set; }

        public decimal? BetTypeBMFrom { get; set; }

        public decimal? BetTypeBMTo { get; set; }

        /// <summary>
        /// Gets Setting Key.
        /// </summary>
        /// <returns>Setting key of the criteria.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_Rpt_Detail_GradeHistory";
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
