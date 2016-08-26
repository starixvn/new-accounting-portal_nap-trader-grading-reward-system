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

        public double TotalPoint { get; set; }

        public double Margin { get; set; }

        public double Turnover { get; set; }

        public double WinLoss { get; set; }

        public int PointDeduction { get; set; }
    }
}
