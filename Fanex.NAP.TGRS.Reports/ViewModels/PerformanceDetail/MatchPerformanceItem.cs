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
    using System;
    using Fanex.Common;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;

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
                this.Turnover = Converter.ToDecimal(matchData.Turnover);
                this.WinLoss = Converter.ToDecimal(matchData.WinLoss);
                this.BetCount = Converter.ToInt(matchData.BetCount);
                this.Margin = matchData.Margin;
            }
        }

        public int MatchId { get; set; }

        public string MatchName { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal? Margin { get; set; }
    }
}