// --------------------------------------------------------------------------
// <copyright file="GetBetTypesCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.9">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail
{
    using Fanex.NAP.Framework.Data;
    using Fanex.NAP.TGRS.Reports.Models.Permission;

    /// <summary>
    /// Getting bet types criteria.
    /// </summary>
    public class GetBetTypesCriteria : CriteriaBase
    {
        public GetBetTypesCriteria() : this(BettypeViewPermission.All) { }

        public GetBetTypesCriteria(BettypeViewPermission permission)
        {
            ViewPermission = (int)permission;
        }

        public int ViewPermission { get; set; }

        /// <summary>
        /// Gets the setting key.
        /// </summary>
        /// <returns>The setting key.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_Bettype_SelList";
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