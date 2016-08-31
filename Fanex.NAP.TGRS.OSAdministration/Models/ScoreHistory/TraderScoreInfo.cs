// --------------------------------------------------------------------------
// <copyright file="TraderScoreInfo.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016.8.25">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSAdministration.Models.ScoreHistory
{
    public class TraderScoreInfo
    {
        public int TraderId { get; set; }

        public string TraderName { get; set; }

        public string TeamName { get; set; }

        public string GradeName { get; set; }

        public decimal TotalPoint { get; set; }

        public decimal Margin { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int PointDeduction { get; set; }
    }
}
