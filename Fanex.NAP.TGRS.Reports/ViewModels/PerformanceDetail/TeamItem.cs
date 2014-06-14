// --------------------------------------------------------------------------
// <copyright file="TeamItem.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail
{
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;

    /// <summary>
    /// Team view model.
    /// </summary>
    public class TeamItem
    {
        public TeamItem(TeamInfo teamData)
        {
            if (teamData != null)
            {
                this.TeamId = teamData.TeamId;
                this.TeamName = teamData.TeamName;
            }
        }

        public short TeamId { get; set; }

        public string TeamName { get; set; }
    }
}