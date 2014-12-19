// -----------------------------------------------------------------------
// <copyright file="MonthAmountItem.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.12.11">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.ViewModels.Dashboard
{
    using Fanex.NAP.TGRS.Reports.Models.Dashboard;

    /// <summary>
    /// Monthly amount item.
    /// </summary>
    public class MonthAmountItem
    {
        public MonthAmountItem(MonthAmount item)
        {
            this.Month = item.EventDate.Value.Month;
            this.Year = item.EventDate.Value.Year;
            this.Turnover = item.Turnover;
            this.Winloss = item.Winlost;
            this.MatchCount = item.MatchCount;
            this.Margin = item.Margin;
        }

        public int Month { get; set; }

        public int Year { get; set; }

        public decimal Turnover { get; set; }

        public decimal Winloss { get; set; }

        public decimal Margin { get; set; }

        public int MatchCount { get; set; }
    }
}
