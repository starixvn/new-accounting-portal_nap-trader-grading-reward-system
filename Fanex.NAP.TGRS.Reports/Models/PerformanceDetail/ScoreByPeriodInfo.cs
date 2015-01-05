// -----------------------------------------------------------------------
// <copyright file="ScoreByPeriodInfo.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.TGRS.Reports.Models.PerformanceDetail
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Score by period model.
    /// </summary>
    public class ScoreByPeriodInfo
    {
        public short? BetType { get; set; }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }

        public decimal? Benchmark { get; set; }

        public decimal? Score { get; set; }
    }
}
