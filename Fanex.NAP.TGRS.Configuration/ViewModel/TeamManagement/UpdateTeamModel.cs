// -----------------------------------------------------------------------
// <copyright file="UpdateTeamModel.cs"  company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.13">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.ViewModel.TeamManagement
{
    /// <summary>
    /// Model for team updating.
    /// </summary>
    public class UpdateTeamModel
    {
        public int TeamId { get; set; }

        public string TeamName { get; set; }

        public string Description { get; set; }

        public int UserId { get; set; }
    }
}
