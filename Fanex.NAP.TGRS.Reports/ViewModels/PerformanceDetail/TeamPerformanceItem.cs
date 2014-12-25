// --------------------------------------------------------------------------
// <copyright file="TeamPerformanceItem.cs" company="Nexcel Solutions Vietnam">
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
    /// Team performance view model.
    /// </summary>
    [Serializable]
    public class TeamPerformanceItem
    {
        public TeamPerformanceItem()
        {
        }

        public TeamPerformanceItem(TeamPerformanceInfo teamData)
        {
            if (teamData != null && teamData.TeamId.HasValue)
            {
                this.TeamId = teamData.TeamId.Value;
                this.TeamName = teamData.TeamName;
                this.NoOfTraders = Converter.ToInt(teamData.TraderCount);
                this.NoOfLeagues = Converter.ToInt(teamData.LeagueCount);
                this.NoOfMatches = Converter.ToInt(teamData.MatchCount);
                this.Turnover = Converter.ToDecimal(teamData.Turnover);
                this.WinLoss = Converter.ToDecimal(teamData.WinLoss);
                this.BetCount = Converter.ToInt(teamData.BetCount);
                this.Margin = teamData.Margin;
                this.TeamBM = teamData.TeamBenchmark;
                this.Score = teamData.Score;
            }
        }

        public int TeamId { get; set; }

        public string TeamName { get; set; }

        public int NoOfTraders { get; set; }

        public int NoOfLeagues { get; set; }

        public int NoOfMatches { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal? Margin { get; set; }

        public decimal? TeamBM { get; set; }

        public decimal? Score { get; set; }
    }
}