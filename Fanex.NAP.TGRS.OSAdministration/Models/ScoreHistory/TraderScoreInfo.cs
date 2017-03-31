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

        public decimal PointDeduction { get; set; }


        public decimal Turnover { get; set; }

        public decimal TurnoverJuice { get; set; }

        public decimal TurnoverLeftover
        {
            get
            {
                return Turnover - TurnoverJuice;
            }
        }

        public decimal WinLoss { get; set; }
        
        public decimal Juice { get; set; }

        public decimal WinlostLeftover
        {
            get
            {
                return WinLoss - Juice;
            }
        }

        public decimal? JuiceMargin
        {
            get
            {
                return TurnoverJuice != 0 ? ((decimal?)(Juice / TurnoverJuice * 100)) : null;
            }
        }

        public decimal? JuiceMarginTotal
        {
            get
            {
                return Turnover != 0 ? ((decimal?)(Juice / Turnover * 100)) : null;
            }
        }

        public decimal? LeftoverMargin
        {
            get
            {
                return TurnoverLeftover != 0 ? ((decimal?)(WinlostLeftover / TurnoverLeftover * 100)) : null;
            }
        }

        public decimal? LeftoverMarginTotal
        {
            get
            {
                return Turnover != 0 ? ((decimal?)(WinlostLeftover / Turnover * 100)) : null;
            }
        }

        public decimal? Margin
        {
            get
            {
                return Turnover != 0 ? ((decimal?)(WinLoss / Turnover * 100)) : null;
            }
        }
    }
}
