// --------------------------------------------------------------------------
// <copyright file="GetLeaguePerformanceCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.9">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail
{
    using System;
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// The criteria which are used to to the data of league performance detail report.
    /// </summary>
    public class GetLeaguePerformanceCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string LeagueName { get; set; }

        public decimal LeagueBMFrom { get; set; }

        public decimal LeagueBMTo { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLost { get; set; }

        public decimal MarginFrom { get; set; }

        public decimal MarginTo { get; set; }

        public string BetTypes { get; set; }

        /// <summary>
        /// Gets the setting key.
        /// </summary>
        /// <returns>The setting key.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_Rpt_DetailLeaguePerformance";
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