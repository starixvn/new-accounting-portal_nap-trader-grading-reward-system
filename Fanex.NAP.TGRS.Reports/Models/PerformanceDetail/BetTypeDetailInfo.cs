// --------------------------------------------------------------------------
// <copyright file="BetTypeDetailInfo.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.7.28">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Models.PerformanceDetail
{
    /// <summary>
    /// Bet type detail model.
    /// </summary>
    public class BetTypeDetailInfo
    {
        public short? BetType { get; set; }

        public string TypeName { get; set; }

        public decimal? Turnover { get; set; }

        public decimal? WinLost { get; set; }

        public int? BetCount { get; set; }

        public decimal? Margin { get; set; }

        public decimal? Benchmark { get; set; }

        public decimal? Score { get; set; }
    }
}