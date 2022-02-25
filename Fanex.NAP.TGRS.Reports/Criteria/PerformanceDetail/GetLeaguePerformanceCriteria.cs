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
    using Fanex.Data.Repository;

    /// <summary>
    /// The criteria which are used to to the data of league performance detail report.
    /// </summary>
    public class GetLeaguePerformanceCriteria : CriteriaBase
    {
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

        public string LeagueGroupIds { get; set; }

        [SpParam(Ignored = true)]
        public bool IsAllLeagueGroup { get; set; }

        public string LeagueName { get; set; }

        public decimal? Turnover { get; set; }

        public decimal? WinLoss { get; set; }

        public decimal? MarginFrom { get; set; }

        public decimal? MarginTo { get; set; }

        [SpParam(Ignored = true)]
        public bool IsReal { get; set; }

        [SpParam(Ignored = true)]
        public bool IsVirtual { get; set; }

        public decimal? TurnoverReal { get; set; }

        public decimal? WinLossReal { get; set; }

        public decimal? MarginFromReal { get; set; }

        public decimal? MarginToReal { get; set; }

        public string BetTypes { get; set; }

        public bool IsExcludeLeagues { get; set; }

        /// <summary>
        /// Gets the setting key.
        /// </summary>
        /// <returns>The setting key.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_Rpt_PerformanceDetail_League";
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