// --------------------------------------------------------------------------
// <copyright file="LeaguePerformanceItem.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.5.17">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail
{
    using System;
    using Fanex.Common;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;

    /// <summary>
    /// League performance view model.
    /// </summary>
    [Serializable]
    public class LeaguePerformanceItem
    {
        public LeaguePerformanceItem()
        {
        }

        public LeaguePerformanceItem(LeaguePerformanceInfo leagueData)
        {
            if (leagueData != null && leagueData.LeagueId.HasValue)
            {
                this.LeagueId = leagueData.LeagueId.Value;
                this.LeagueName = leagueData.LeagueName;
                this.NoOfTraders = Converter.ToInt(leagueData.TraderCount);
                this.NoOfMatches = Converter.ToInt(leagueData.MatchCount);
                this.Turnover = Converter.ToDecimal(leagueData.Turnover);
                this.WinLoss = Converter.ToDecimal(leagueData.WinLoss);
                this.BetCount = Converter.ToInt(leagueData.BetCount);
                this.LeagueBM = Converter.ToDecimal(leagueData.LeagueBenchmark);
                this.BetTypeBMShift1 = Converter.ToDecimal(leagueData.BetTypeBMShift1);
                this.BetTypeBMShift2 = Converter.ToDecimal(leagueData.BetTypeBMShift2);
                this.BetTypeBMShift3 = Converter.ToDecimal(leagueData.BetTypeBMShift3);
                this.Margin = leagueData.Margin;
            }
        }

        public int LeagueId { get; set; }

        public string LeagueName { get; set; }

        public int NoOfTraders { get; set; }

        public int NoOfMatches { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal? Margin { get; set; }

        public decimal LeagueBM { get; set; }

        public decimal BetTypeBMShift1 { get; set; }

        public decimal BetTypeBMShift2 { get; set; }

        public decimal BetTypeBMShift3 { get; set; }
    }
}