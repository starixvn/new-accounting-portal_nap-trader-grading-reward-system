// --------------------------------------------------------------------------
// <copyright file="BetTypeDetailItem.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.7.28">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail
{
    using System;
    using System.Collections.Generic;
    using Fanex.Common;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;

    /// <summary>
    /// Bet type detail view model.
    /// </summary>
    [Serializable]
    public class BetTypeDetailItem
    {
        public BetTypeDetailItem(BetTypeDetailInfo betType)
        {
            if (betType != null)
            {
                this.BetType = Converter.To<short>(betType.BetType);
                this.TypeName = betType.TypeName;
                this.Turnover = Converter.ToDecimal(betType.Turnover);
                this.WinLoss = Converter.ToDecimal(betType.WinLoss);
                this.BetCount = Converter.ToInt(betType.BetCount);
                this.Margin = betType.Margin;
                this.Benchmark = Converter.ToDecimal(betType.Benchmark);
                this.Score = betType.Score;
            }
        }

        public short BetType { get; set; }

        public string TypeName { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal? Margin { get; set; }

        public decimal? Benchmark { get; set; }

        public decimal? Score { get; set; }

        public List<ScoreByPeriodItem> ScoreByPeriod { get; set; }
    }
}