// -----------------------------------------------------------------------
// <copyright file="GradeHistoryDetail.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.6.2">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Models.PerformanceSummary
{
    using System;

    /// <summary>
    /// GradeHistoryDetail model.
    /// </summary>
    public class GradeHistoryDetail
    {
        public int CustId { get; set; }

        public int Grade { get; set; }

        public DateTime GradeEffectiveDate { get; set; }

        public int MatchCount { get; set; }

        public int BetCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLost { get; set; }

        public decimal? Margin { get; set; }
    }
}
