// --------------------------------------------------------------------------
// <copyright file="GetTeamPerformanceCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail
{
    using System;
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// Getting team performance criteria.
    /// </summary>
    public class GetTeamPerformanceCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string TeamIds { get; set; }

        public decimal? TeamBMFrom { get; set; }

        public decimal? TeamBMTo { get; set; }

        public decimal? Turnover { get; set; }

        public decimal? WinLost { get; set; }

        public decimal? MarginFrom { get; set; }

        public decimal? MarginTo { get; set; }

        public string BetTypes { get; set; }

        /// <summary>
        /// Gets the setting key.
        /// </summary>
        /// <returns>The setting key.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_Rpt_DetailTeamPerformance";
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