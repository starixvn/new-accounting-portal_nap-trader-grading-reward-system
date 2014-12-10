// -----------------------------------------------------------------------
// <copyright file="ScoreByPeriodItem.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail
{
    using System;
    using Fanex.Common;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;

    /// <summary>
    /// Score by period item.
    /// </summary>
    [Serializable]
    public class ScoreByPeriodItem
    {
        public ScoreByPeriodItem(ScoreByPeriodInfo scoreInfo)
        {
            this.BetType = Converter.To<short>(scoreInfo.BetType);
            this.Period = Converter.To<byte>(scoreInfo.Period);
            this.FromDate = Converter.ToDateTime(scoreInfo.FromDate).ToString("MM/dd/yyyy");
            this.ToDate = Converter.ToDateTime(scoreInfo.ToDate).ToString("MM/dd/yyyy");
            this.Score = Converter.ToDecimal(scoreInfo.BetType);
        }

        public short BetType { get; set; }

        public byte Period { get; set; }

        public string FromDate { get; set; }

        public string ToDate { get; set; }

        public decimal Score { get; set; }
    }
}