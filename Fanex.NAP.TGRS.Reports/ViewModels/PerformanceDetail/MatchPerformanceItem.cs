// --------------------------------------------------------------------------
// <copyright file="MatchPerformanceItem.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.5.17">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail
{
    using Fanex.Common;
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using System;

    /// <summary>
    /// Match performance view model.
    /// </summary>
    [Serializable]
    public class MatchPerformanceItem
    {
        public MatchPerformanceItem()
        {
        }

        public MatchPerformanceItem(MatchPerformanceInfo matchData)
        {
            if (matchData != null && matchData.MatchId.HasValue)
            {
                this.MatchId = matchData.MatchId.Value;
                this.MatchName = string.Format("{0} {1} {2}", CacheRef.GetTeamName(matchData.HomeId), ViewLang.Vs, CacheRef.GetTeamName(matchData.AwayId));
                this.EventDate = Convert.ToDateTime(matchData.EventDate).ToShortFormatedDate();
                this.Turnover = Converter.ToDecimal(matchData.Turnover);
                this.WinLoss = Converter.ToDecimal(matchData.WinLoss);
                this.BetCount = Converter.ToInt(matchData.BetCount);
                this.Margin = matchData.Margin;
                this.Score = matchData.Score;
            }
        }

        public MatchPerformanceItem(MatchPerformanceRawInfo matchData)
        {
            if (matchData != null && matchData.MatchId.HasValue)
            {
                this.MatchId = matchData.MatchId.Value;
                this.MatchName = string.Format("{0} {1} {2}", CacheRef.GetTeamName(matchData.HomeId), ViewLang.Vs, CacheRef.GetTeamName(matchData.AwayId));
                this.EventDate = Convert.ToDateTime(matchData.EventDate).ToShortFormatedDate();
                this.Turnover = Converter.ToDecimal(matchData.Turnover);
                this.WinLoss = Converter.ToDecimal(matchData.WinLoss);
                this.BetCount = Converter.ToInt(matchData.BetCount);
                this.Margin = matchData.Margin;
                this.Score = matchData.SumCategory == 0 ? null : (matchData.WinLossScore * 100 / matchData.SumCategory);
                this.WinLossScore = Converter.ToDecimal(matchData.WinLossScore);
                this.SumCategory = Converter.ToDecimal(matchData.SumCategory);
            }
        }

        public int MatchId { get; set; }

        public string MatchName { get; set; }

        public string EventDate { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal? Margin { get; set; }

        public decimal? Score { get; set; }

        public decimal WinLossScore { get; set; }

        public decimal SumCategory { get; set; }
    }
}