// -----------------------------------------------------------------------
// <copyright file="GradeHistoryDetailItem.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceSummary
{
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;

    /// <summary>
    /// GradeHistory model.
    /// </summary>
    public class GradeHistoryDetailItem
    {
        public GradeHistoryDetailItem(GradeHistoryDetail item)
        {
            this.CustId = item.CustId;
            this.Grade = item.Grade;
            this.GradeEffectiveDate = item.GradeEffectiveDate.ToShortFormatedDate();
            this.MatchCount = item.MatchCount;
            this.BetCount = item.BetCount;
            this.Turnover = item.Turnover;
            this.WinLost = item.WinLost;
            this.Margin = item.Margin;
        }

        public int CustId { get; set; }

        public int Grade { get; set; }

        public string GradeEffectiveDate { get; set; }

        public int MatchCount { get; set; }

        public int BetCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLost { get; set; }

        public decimal? Margin { get; set; }
    }
}
