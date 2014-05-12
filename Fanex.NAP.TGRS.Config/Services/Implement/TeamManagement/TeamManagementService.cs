// -----------------------------------------------------------------------
// <copyright file="TeamManagementService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// <history>
//   <change who="Ken.Nguyen" date="2014.5.12">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Services.Implement.TeamManagement
{
    using Fanex.NAP.Core.Service.Impl;
    using Fanex.NAP.TGRS.Configuration.Criteria.TeamManagement;
    using Fanex.NAP.TGRS.Configuration.Models.TeamManagement;
    using Fanex.NAP.TGRS.Configuration.Services.Interface.TeamManagement;
    using Fanex.NAP.TGRS.Configuration.ViewModel.TeamManagement;

    /// <summary>
    /// Team Management Service.
    /// </summary>
    public class TeamManagementService : BaseService, ITeamManagementService
    {
        /// <summary>
        /// Get all team.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of Team information.</returns>
        public TeamInfoList GetAllTeam(GetAllTeamsCriteria criteria)
        {
            TeamInfoList result = null;

            if (result == null)
            {
                var rawData = this.GetData<TeamInfo>(criteria);

                if (rawData != null)
                {
                    result = new TeamInfoList();

                    foreach (TeamInfo team in rawData)
                    {
                        var teamInfoItem = new TeamInfoItem(team);

                        result.Add(teamInfoItem);
                    }
                }
            }

            return result;
        }
    }
}
