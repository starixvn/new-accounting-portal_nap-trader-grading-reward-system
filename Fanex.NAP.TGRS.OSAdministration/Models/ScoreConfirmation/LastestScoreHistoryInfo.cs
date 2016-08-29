// --------------------------------------------------------------------------
// <copyright file="LastestScoreHistoryInfo.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2016.8.26">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSAdministration.Models.ScoreConfirmation
{
    using System;

    public class LastestScoreHistoryInfo
    {
        public string Creator { get; set; }

        public string PeriodName { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string FormattedFromDate
        {
            get
            {
                return FromDate.ToString("MM/dd/yyyy");
            }
        }

        public string FormattedToDate
        {
            get
            {
                return ToDate.ToString("MM/dd/yyyy");
            }
        }
    }
}
