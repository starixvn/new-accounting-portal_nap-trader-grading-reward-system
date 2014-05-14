// --------------------------------------------------------------------------
// <copyright file="UpdateTeamBenchmarkCriteria.cs" company="Nexcel Solutions Vietnam">
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
    /// The criteria that are used to update benchmark of a team.
    /// </summary>
    public class UpdateTeamBenchmarkCriteria : CriteriaBase
    {
        public int TeamId { get; set; }

        public decimal Benchmark { get; set; }

        public int UserId { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        /// <summary>
        /// Gets the setting key.
        /// </summary>
        /// <returns>The setting key.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_BenchmarkTeam_Update";
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