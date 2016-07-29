// -----------------------------------------------------------------------
// <copyright file="TeamInfo.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Aaron" date="2016.07.29">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSConfiguration.Models.TeamManagement
{
    using System;

    public class TeamInfo
    {
        public int TeamId { get; set; }

        public string TeamName { get; set; }

        public int TraderCount { get; set; }

        public DateTime CreatedDate { get; set; }

        public string CreatedBy { get; set; }

        public string CreatedDateFormatted
        {
            get
            {
                return CreatedDate.ToString("dd-MM-yyyy hh:mm:ss");
            }
        }
    }
}