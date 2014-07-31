// -----------------------------------------------------------------------
// <copyright file="TeamManagementService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// <history>
//   <change who="Ken.Nguyen" date="2014.5.12">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Services.TeamManagement
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Configuration.Criteria.TeamManagement;
    using Fanex.NAP.TGRS.Configuration.Models.TeamManagement;
    using Fanex.NAP.TGRS.Configuration.Services.TeamManagement;
    using Fanex.NAP.TGRS.Configuration.ViewModel.TeamManagement;
    using Fanex.NAP.TGRS.Core.BaseClasses;

    /// <summary>
    /// Team Management Service.
    /// </summary>
    public class TeamManagementService : TGRSBaseService, ITeamManagementService
    {
        /// <summary>
        /// Get all team.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of Team information.</returns>
        public TeamInfoList GetAllTeam(GetAllTeamsCriteria criteria)
        {
            TeamInfoList result = null;

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

            return result;
        }

        /// <summary>
        /// Get all team for select list.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of Team information.</returns>
        public TeamInfoList GetTeamSelectList(GetTeamSelectListCriteria criteria)
        {
            TeamInfoList result = null;

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

            return result;
        }

        /// <summary>
        /// Insert new team.
        /// </summary>
        /// <param name="criteria">The criteria that are used to insert data.</param>
        /// <returns>Result of insert.</returns>
        public ICommandResult InsertTeam(InsertTeamCriteria criteria)
        {
            return this.UpdateData(criteria);
        }

        /// <summary>
        /// Update new team.
        /// </summary>
        /// <param name="criteria">The criteria that are used to update data.</param>
        /// <returns>Result of update.</returns>
        public ICommandResult UpdateTeam(UpdateTeamCriteria criteria)
        {
            return this.UpdateData(criteria);
        }
    }
}
