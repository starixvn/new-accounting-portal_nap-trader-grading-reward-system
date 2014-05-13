// -----------------------------------------------------------------------
// <copyright file="UpdateTeamCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.12">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Criteria.TeamManagement
{
    using System;
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// Update team criteria.
    /// </summary>
    public class UpdateTeamCriteria : CriteriaBase
    {
        public int TeamId { get; set; }

        public string TeamName { get; set; }

        public string Description { get; set; }

        public int UserId { get; set; }

        public int ErrorCode { get; set; }

        public string ErrorMsg { get; set; }

        /// <summary>
        /// Gets Setting Key.
        /// </summary>
        /// <returns>Setting key of the criteria.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_Grade_Update";
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
