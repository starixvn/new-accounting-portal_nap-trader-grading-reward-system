// -----------------------------------------------------------------------
// <copyright file="GetTopTraderCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.26">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceSummary
{
    using System;
    using Fanex.Data.Repository;

    /// <summary>
    /// Get top trader.
    /// </summary>
    public class GetTopTraderCriteria : BettypeGroupCriteria
    {
        public int Top { get; set; }

        public int IsBottom { get; set; }

        public int ReportType { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        /// <summary>
        /// Gets Setting Key.
        /// </summary>
        /// <returns>Setting key of the criteria.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_Rpt_SummaryTopTrader";
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
