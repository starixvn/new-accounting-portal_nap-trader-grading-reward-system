// -----------------------------------------------------------------------
// <copyright file="TeamHistory.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Models.TraderManagement
{
    using System;

    /// <summary>
    /// TeamHistory model.
    /// </summary>
    public class TeamHistory
    {
        public int TeamId { get; set; }

        public string TeamName { get; set; }

        public DateTime EffectiveDate { get; set; }
    }
}
