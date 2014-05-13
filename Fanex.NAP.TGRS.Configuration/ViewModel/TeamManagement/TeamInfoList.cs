// -----------------------------------------------------------------------
// <copyright file="TeamInfoList.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.12">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.ViewModel.TeamManagement
{
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// List of Team Info Item.
    /// </summary>
    [Serializable]
    public class TeamInfoList
    {
        public TeamInfoList()
        {
            this.TeamInfoItems = new List<TeamInfoItem>();
        }

        public List<TeamInfoItem> TeamInfoItems { get; set; }

        public void Add(TeamInfoItem teamInfoItem)
        {
            if (teamInfoItem != null)
            {
                TeamInfoItems.Add(teamInfoItem);
            }
        }
    }
}
