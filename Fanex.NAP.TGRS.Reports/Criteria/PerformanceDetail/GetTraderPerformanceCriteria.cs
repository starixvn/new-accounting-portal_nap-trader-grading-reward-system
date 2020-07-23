// --------------------------------------------------------------------------
// <copyright file="GetTraderPerformanceCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.12">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail
{
    using System;
    using Fanex.Data.Repository;

    /// <summary>
    /// Getting trader performance criteria.
    /// </summary>
    public class GetTraderPerformanceCriteria : CriteriaBase
    {
        public string Username { get; set; }

        [SpParam(Ignored = true)]
        public Market MarketFilter { get; set; }

        public Int16 Market
        {
            get
            {
                switch (this.MarketFilter)
                {
                    case Reports.Market.Live:
                        return 1;
                    case Reports.Market.NonLive:
                        return 0;
                    default:
                        return -1;
                }
            }
        }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public decimal? Turnover { get; set; }

        public decimal? WinLoss { get; set; }

        public decimal? MarginFrom { get; set; }

        public decimal? MarginTo { get; set; }

        public string BetTypes { get; set; }

        public bool IsExcludeLeagues { get; set; }

        public string LeagueGroupIds { get; set; }

        /// <summary>
        /// Gets the setting key.
        /// </summary>
        /// <returns>The setting key.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_Rpt_PerformanceDetail_Trader";
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