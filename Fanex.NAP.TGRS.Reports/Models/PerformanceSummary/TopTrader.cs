// -----------------------------------------------------------------------
// <copyright file="TopTrader.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.26">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Models.PerformanceSummary
{
    using System;

    /// <summary>
    /// Summary Report Top Trader information model.
    /// </summary>
    public class TopTrader
    {
        public int CustId { get; set; }

        public string UserName { get; set; }

        public string TeamName { get; set; }

        public int Grade { get; set; }

        public int MatchCount { get; set; }

        public int BetCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal Winlost { get; set; }

        public decimal? Margin { get; set; }

        public int NoOfTeamChange { get; set; }

        public int NoOfGradeChange { get; set; }
    }
}
