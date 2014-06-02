// -----------------------------------------------------------------------
// <copyright file="TeamHistoryGeneralItem.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceSummary
{
    using System;
    using System.Data;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;

    /// <summary>
    /// TeamHistory model.
    /// </summary>
    public class TeamHistoryGeneralItem
    {
        public TeamHistoryGeneralItem(TeamHistoryGeneral item)
        {
            this.TeamId = item.TeamId;
            this.TeamName = item.TeamName;
            this.EffectiveDate = item.EffectiveDate.ToShortDateString();
        }

        public int TeamId { get; set; }

        public string TeamName { get; set; }

        public string EffectiveDate { get; set; }
    }
}
