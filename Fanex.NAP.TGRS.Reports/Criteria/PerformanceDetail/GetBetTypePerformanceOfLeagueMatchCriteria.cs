// --------------------------------------------------------------------------
// <copyright file="GetBetTypePerformanceCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Thai.Tran" date="2016.3.28">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail
{
    using Fanex.Data.Repository;
    using System;

    /// <summary>
    /// Getting performance data of bet types.
    /// </summary>
    public class GetBetTypePerformanceOfLeagueMatchCriteria : CriteriaBase
    {
        [SpParam(Ignored = true)]
        public bool IsLive { get; set; }

        public Int16 Market
        {
            get
            {
                if (this.IsLive)
                {
                    return 1;
                }

                return 0;
            }
        }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int LeagueId { get; set; }

        public int MatchId { get; set; }

        public string Bettypes { get; set; }

        public bool IsExcludeLeagues { get; set; }

        /// <summary>
        /// Gets the setting key.
        /// </summary>
        /// <returns>The setting key.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_Rpt_PerformanceDetail_League_Match_Bettype";
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