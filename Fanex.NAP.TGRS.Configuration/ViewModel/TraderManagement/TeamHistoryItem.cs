// -----------------------------------------------------------------------
// <copyright file="TeamHistoryItem.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.ViewModel.TraderManagement
{
    using System;
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Configuration.Models.TraderManagement;

    /// <summary>
    /// TeamHistory model.
    /// </summary>
    public class TeamHistoryItem
    {
        public TeamHistoryItem(TeamHistory teamHistory)
        {
            this.TeamId = teamHistory.TeamId;
            this.TeamName = teamHistory.TeamName;
            this.EffectiveDate = teamHistory.EffectiveDate.ToShortFormatedDate();
        }

        public int TeamId { get; set; }

        public string TeamName { get; set; }

        public string EffectiveDate { get; set; }
    }
}
