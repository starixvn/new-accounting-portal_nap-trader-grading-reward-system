// --------------------------------------------------------------------------
// <copyright file="GetLeagueIdsCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Thai.Tran" date="2016.01.22">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Criteria.Common
{
    using Fanex.Data.Repository;

    /// <summary>
    /// The criteria that are used to get league Ids.
    /// </summary>
    public class GetLeagueIdsCriteria : CriteriaBase
    {        
        /// <summary>
        /// Gets the setting key.
        /// </summary>
        /// <returns>The setting key.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_League_SelectList";
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