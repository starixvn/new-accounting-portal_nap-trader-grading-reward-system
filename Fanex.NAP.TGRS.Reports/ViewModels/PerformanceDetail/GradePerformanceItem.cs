// --------------------------------------------------------------------------
// <copyright file="GradePerformanceItem.cs" company="Nexcel Solutions Vietnam">
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
    /// Grade performance view model.
    /// </summary>
    [Serializable]
    public class GradePerformanceItem
    {
        public GradePerformanceItem()
        {
        }

        public GradePerformanceItem(GradePerformanceInfo gradeData)
        {
            if (gradeData != null && gradeData.Grade.HasValue)
            {
                this.Grade = gradeData.Grade.Value;
                this.NoOfTraders = Converter.ToInt(gradeData.TraderCount);
                this.NoOfLeagues = Converter.ToInt(gradeData.LeagueCount);
                this.NoOfMatches = Converter.ToInt(gradeData.MatchCount);
                this.Turnover = Converter.ToDecimal(gradeData.Turnover);
                this.WinLoss = Converter.ToDecimal(gradeData.WinLoss);                
                this.Margin = gradeData.Margin;
                this.TurnoverReal = Converter.ToDecimal(gradeData.TurnoverReal);
                this.WinLossReal = Converter.ToDecimal(gradeData.WinLossReal);
                this.MarginReal = gradeData.MarginReal;
                this.BetCount = Converter.ToInt(gradeData.BetCount);
                this.Score = gradeData.Score;
                this.IsLive = gradeData.IsLive;
            }
        }

        public int Grade { get; set; }

        public int NoOfTraders { get; set; }

        public int NoOfLeagues { get; set; }

        public int NoOfMatches { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal? Margin { get; set; }

        public decimal TurnoverReal { get; set; }

        public decimal WinLossReal { get; set; }

        public decimal? MarginReal { get; set; }

        public int BetCount { get; set; }

        public decimal? Score { get; set; }

        public bool IsLive { get; set; }
    }
}