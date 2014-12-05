// --------------------------------------------------------------------------
// <copyright file="UpdateDefaultBettypeCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.12.4">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Criteria.SystemConfiguration
{
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// The criteria that are used to update benchmark of a team.
    /// </summary>
    public class UpdateDefaultBettypeCriteria : CriteriaBase
    {
        public string BetTypes { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        /// <summary>
        /// Gets the setting key.
        /// </summary>
        /// <returns>The setting key.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_DefaultBettype_Update";
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