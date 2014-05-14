// -----------------------------------------------------------------------
// <copyright file="TeamInfoItem.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.12">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.ViewModel.TeamManagement
{
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Configuration.Models.TeamManagement;

    /// <summary>
    /// Team info view model.
    /// </summary>
    public class TeamInfoItem
    {
        public TeamInfoItem(TeamInfo teamInfo)
        {
            this.TeamId = teamInfo.TeamId;
            this.TeamName = teamInfo.TeamName;
            this.Description = teamInfo.Description;
            this.TraderCount = teamInfo.TraderCount;
            this.CreatedDate = teamInfo.CreatedDate.ToFullFormatedDate();
            this.CreatedBy = teamInfo.CreatedBy;
            this.CreatedUsername = teamInfo.CreatedUsername;
        }

        public int TeamId { get; set; }

        public string TeamName { get; set; }

        public string Description { get; set; }

        public int TraderCount { get; set; }

        public string CreatedDate { get; set; }

        public int CreatedBy { get; set; }

        public string CreatedUsername { get; set; }
    }
}
