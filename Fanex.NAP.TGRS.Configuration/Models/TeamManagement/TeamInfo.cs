// -----------------------------------------------------------------------
// <copyright file="TeamInfo.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.12">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Models.TeamManagement
{
    using System;

    /// <summary>
    /// Team information model.
    /// </summary>
    public class TeamInfo
    {
        public int TeamId { get; set; }

        public string TeamName { get; set; }

        public string Description { get; set; }

        public int TraderCount { get; set; }

        public DateTime CreatedDate { get; set; }

        public int CreatedBy { get; set; }

        public string CreatedUsername { get; set; }

        public decimal AvgGrade { get; set; }
    }
}
