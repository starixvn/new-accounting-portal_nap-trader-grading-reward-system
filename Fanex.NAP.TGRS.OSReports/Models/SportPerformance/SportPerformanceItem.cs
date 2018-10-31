// -----------------------------------------------------------------------
// <copyright file="SportPerformanceItem.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Aaron" date="2016.08.16">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSReports.Models.SportPerformance
{
    public class SportPerformanceItem
    {
        public int SportId { get; set; }

        public string SportName { get; set; }

        public int NoOfLeague { get; set; }

        public int RegionCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal VWinLoss { get; set; }

        public decimal? VMargin { get; set; }

        public decimal? AverageVTurnover { get; set; }

        public decimal? PointMargin { get; set; }

        public int BetCount { get; set; }
    }
}
