// --------------------------------------------------------------------------
// <copyright file="BetTypePerformanceItem.cs" company="Nexcel Solutions Vietnam">
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
    /// Bet type performance view model.
    /// </summary>
    [Serializable]
    public class BetTypePerformanceItem
    {
        public BetTypePerformanceItem()
        {
        }

        public BetTypePerformanceItem(BetTypePerformanceInfo betTypeData)
        {
            if (betTypeData != null && betTypeData.BetType.HasValue)
            {
                this.BetTypeId = betTypeData.BetType.Value;
                this.BetTypeName = betTypeData.TypeName;
                this.NoOfTraders = Converter.ToInt(betTypeData.TraderCount);
                this.NoOfLeagues = Converter.ToInt(betTypeData.LeagueCount);
                this.NoOfMatches = Converter.ToInt(betTypeData.MatchCount);
                this.Turnover = Converter.ToDecimal(betTypeData.Turnover);
                this.WinLoss = Converter.ToDecimal(betTypeData.WinLoss);
                this.BetCount = Converter.ToInt(betTypeData.BetCount);
                this.Margin = betTypeData.Margin;
                this.IsLive = betTypeData.IsLive;
            }
        }

        public int BetTypeId { get; set; }

        public string BetTypeName { get; set; }

        public int NoOfTraders { get; set; }

        public int NoOfLeagues { get; set; }

        public int NoOfMatches { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal? Margin { get; set; }

        public bool IsLive { get; set; }
    }
}