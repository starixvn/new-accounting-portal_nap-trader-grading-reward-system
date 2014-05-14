// --------------------------------------------------------------------------
// <copyright file="GetTeamProfitMarginCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Criteria.BenchmarkManagement
{
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// The criteria that are used to get profit margin of a team.
    /// </summary>
    public class GetTeamProfitMarginCriteria : CriteriaBase
    {
        public int TeamId { get; set; }

        /// <summary>
        /// Gets the setting key.
        /// </summary>
        /// <returns>The setting key.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_BenchmarkTeam_ProfitMargin";
        }

        /// <summary>
        /// Determines whether this criteria is valid.
        /// </summary>
        /// <returns>Whether this criteria is valid or not.</returns>
        public override bool IsValid()
        {
            return true;
        }
    }
}