// -----------------------------------------------------------------------
// <copyright file="TeamHistoryDetailItem.cs" company="Nexcel Solutions Vietnam">
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
    /// TeamHistory model.
    /// </summary>
    public class TeamHistoryDetailItem
    {
        public TeamHistoryDetailItem(TeamHistoryDetail item)
        {
            this.CustId = item.CustId;
            this.TeamId = item.TeamId;
            this.TeamName = item.TeamName;
            this.TeamEffectiveDate = item.TeamEffectiveDate.ToShortFormatedDate();
            this.MatchCount = item.MatchCount;
            this.BetCount = item.BetCount;
            this.Turnover = item.Turnover;
            this.WinLost = item.WinLost;
            this.Margin = item.Margin;
        }

        public int CustId { get; set; }

        public int TeamId { get; set; }

        public string TeamName { get; set; }

        public string TeamEffectiveDate { get; set; }

        public int MatchCount { get; set; }

        public int BetCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLost { get; set; }

        public decimal? Margin { get; set; }
    }
}
