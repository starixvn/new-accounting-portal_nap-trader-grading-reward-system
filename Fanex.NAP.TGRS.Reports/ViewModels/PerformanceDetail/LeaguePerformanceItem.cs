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
    using Fanex.NAP.TGRS.Core.Resources;
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
                this.LeagueGroupId = Converter.ToInt(leagueData.LeagueGroupID);
                this.NoOfTraders = Converter.ToInt(leagueData.TraderCount);
                this.NoOfMatches = Converter.ToInt(leagueData.MatchCount);
                this.Turnover = Converter.ToDecimal(leagueData.Turnover);
                this.WinLoss = Converter.ToDecimal(leagueData.WinLoss);
                this.BetCount = Converter.ToInt(leagueData.BetCount);
                this.BetTypeBMShift1 = leagueData.BetTypeBMShift1;
                this.BetTypeBMShift2 = leagueData.BetTypeBMShift2;
                this.BetTypeBMShift3 = leagueData.BetTypeBMShift3;
                this.Margin = leagueData.Margin;
                this.Market = GetMaketToString(leagueData.Market);
                this.IsLive = leagueData.IsLive;
                this.FlagForViewReport = leagueData.FlagForViewReport;
            }
        }

        public int LeagueId { get; set; }

        public string LeagueName { get; set; }

        public int LeagueGroupId { get; set; }

        public string LeagueGroupName { get; set; }

        public int NoOfTraders { get; set; }

        public int NoOfMatches { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal? Margin { get; set; }

        public decimal? BetTypeBMShift1 { get; set; }

        public decimal? BetTypeBMShift2 { get; set; }

        public decimal? BetTypeBMShift3 { get; set; }

        public string Market { get; set; }

        private string GetMaketToString(Market market)
        {
            if (market == Reports.Market.Live)
            {
                return ViewLang.MarketLive;
            }

            return ViewLang.MarketNonLive;
        }

        public bool IsLive { get; set; }

        public int FlagForViewReport { get; set; }
    }
}