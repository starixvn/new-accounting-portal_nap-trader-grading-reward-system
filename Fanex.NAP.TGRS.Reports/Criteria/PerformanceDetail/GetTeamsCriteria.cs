// -----------------------------------------------------------------------
// <copyright file="GetTeamsCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Jason" date="2014.6.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail
{
    using Fanex.Data.Repository;

    /// <summary>
    /// Get all teams.
    /// </summary>
    public class GetTeamsCriteria : CriteriaBase
    {
        /// <summary>
        /// Gets Setting Key.
        /// </summary>
        /// <returns>Setting key of the criteria.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_Team_SelList";
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