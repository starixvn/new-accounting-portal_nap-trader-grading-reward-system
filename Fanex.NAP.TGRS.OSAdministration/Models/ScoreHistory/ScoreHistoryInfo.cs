// --------------------------------------------------------------------------
// <copyright file="IScoreHistoryService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016.8.25">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSAdministration.Models.ScoreHistory
{
    using System;

    public class ScoreHistoryInfo
    {
        public int ScoreHistoryId { get; set; }

        public string PeriodName { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string ConfirmedBy { get; set; }

        public DateTime ConfirmedDate { get; set; }

        public string FromDateFormatted
        {
            get
            {
                return FromDate.ToString("MM/dd/yyyy");
            }
        }

        public string ToDateFormatted
        {
            get
            {
                return ToDate.ToString("MM/dd/yyyy");
            }
        }

        public string ConfirmedDateFormatted
        {
            get
            {
                return ConfirmedDate.ToString("MM/dd/yyyy");
            }
        }

        public string ScoreHistoryHeader
        {
            get
            {
                return PeriodName + " (" + FromDateFormatted + "-" + ToDateFormatted + ")";
            }
        }
    }
}
