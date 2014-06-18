// --------------------------------------------------------------------------
// <copyright file="GetMatchPerformanceOfBetTypeLeagueTraderCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.18">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail
{
    using System;
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// The criteria that are used to get the match performance of a bet type.
    /// </summary>
    public class GetMatchPerformanceOfBetTypeLeagueTraderCriteria : CriteriaBase
    {
        public short Bettype { get; set; }

        public int LeagueId { get; set; }

        public int CustID { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public decimal? BetTypeBMFrom { get; set; }

        public decimal? BetTypeBMTo { get; set; }

        /// <summary>
        /// Gets the setting key.
        /// </summary>
        /// <returns>The setting key.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_Rpt_DetailBetType_MatchByTraderLeague";
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