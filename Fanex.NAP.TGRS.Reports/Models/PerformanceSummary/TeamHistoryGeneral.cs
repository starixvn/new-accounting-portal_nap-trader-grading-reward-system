// -----------------------------------------------------------------------
// <copyright file="TeamHistoryGeneral.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Models.PerformanceSummary
{
    using System;
    using System.Data;

    /// <summary>
    /// TeamHistory model.
    /// </summary>
    public class TeamHistoryGeneral
    {
        public TeamHistoryGeneral(DataRow row)
        {
            this.TeamId = Convert.ToInt32(row["TeamId"]);
            this.TeamName = Convert.ToString(row["TeamName"]);
            this.EffectiveDate = Convert.ToDateTime(row["EffectiveDate"]);
        }

        public int TeamId { get; set; }

        public string TeamName { get; set; }

        public DateTime EffectiveDate { get; set; }
    }
}
