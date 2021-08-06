// --------------------------------------------------------------------------
// <copyright file="TraderPerformanceItem.cs" company="Nexcel Solutions Vietnam">
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
    /// Trader performance view model.
    /// </summary>
    [Serializable]
    public class TraderPerformanceItem
    {
        public TraderPerformanceItem()
        {
        }

        public TraderPerformanceItem(TraderPerformanceInfo traderData)
        {
            if (traderData != null && traderData.CustId.HasValue)
            {
                this.TraderId = traderData.CustId.Value;
                this.TraderName = traderData.Username;
                this.Grade = Converter.ToInt(traderData.Grade);
                this.HasGradeHistory = Converter.ToInt(traderData.NoOfGradeChanged) > 1;
                this.TeamId = Converter.ToInt(traderData.TeamId);
                this.TeamName = traderData.TeamName;
                this.HasTeamHistory = Converter.ToInt(traderData.NoOfTeamChanged) > 1;
                this.NoOfLeagues = Converter.ToInt(traderData.LeagueCount);
                this.NoOfMatches = Converter.ToInt(traderData.MatchCount);
                this.BetCount = Converter.ToInt(traderData.BetCount);
                this.Turnover = Converter.ToDecimal(traderData.Turnover);
                this.WinLoss = Converter.ToDecimal(traderData.WinLoss);               
                this.Margin = traderData.Margin;
                this.TurnoverReal = Converter.ToDecimal(traderData.TurnoverReal);
                this.WinLossReal = Converter.ToDecimal(traderData.WinLossReal);
                this.MarginReal = traderData.MarginReal;
                this.Score = traderData.Score;
                this.IsLive = traderData.IsLive;
            }
        }

        public int TraderId { get; set; }

        public string TraderName { get; set; }

        public int Grade { get; set; }

        public bool HasGradeHistory { get; set; }

        public int TeamId { get; set; }

        public string TeamName { get; set; }

        public bool HasTeamHistory { get; set; }

        public int NoOfLeagues { get; set; }

        public int NoOfMatches { get; set; }

        public int BetCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }
       
        public decimal? Margin { get; set; }

        public decimal TurnoverReal { get; set; }

        public decimal WinLossReal { get; set; }

        public decimal? MarginReal { get; set; }

        public decimal? Score { get; set; }

        public bool IsLive { get; set; }
    }
}