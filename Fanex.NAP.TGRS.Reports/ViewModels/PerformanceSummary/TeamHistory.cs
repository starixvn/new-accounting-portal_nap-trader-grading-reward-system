// --------------------------------------------------------------------------
// <copyright file="TeamHistory.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.5.17">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceSummary
{
    using System;
    using System.Collections.Generic;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;

    /// <summary>
    /// Bet type performance view model.
    /// </summary>
    [Serializable]
    public class TeamHistory
    {
        public TeamHistory()
        {
            this.TeamHistoryGeneral = new List<TeamHistoryGeneralItem>();
            this.TeamHistoryDetail = new List<TeamHistoryDetail>();
        }

        public List<TeamHistoryGeneralItem> TeamHistoryGeneral { get; set; }

        public List<TeamHistoryDetail> TeamHistoryDetail { get; set; }

        /// <summary>
        /// Adds an item to the team history.
        /// </summary>
        /// <param name="item">The item that needs to be added.</param>
        public void AddTeamHistoryGeneral(TeamHistoryGeneral item)
        {
            if (item != null)
            {
                this.TeamHistoryGeneral.Add(new TeamHistoryGeneralItem(item));
            }
        }

        /// <summary>
        /// Adds an item to the team history detail.
        /// </summary>
        /// <param name="item">The item that needs to be added.</param>
        public void AddTeamHistoryDetail(TeamHistoryDetail item)
        {
            if (item != null)
            {
                this.TeamHistoryDetail.Add(item);
            }
        }
    }
}