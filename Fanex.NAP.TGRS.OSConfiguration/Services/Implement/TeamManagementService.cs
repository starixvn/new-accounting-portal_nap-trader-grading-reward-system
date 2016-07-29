// -----------------------------------------------------------------------
// <copyright file="TeamManagementService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Aaron" date="2016.07.29">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSConfiguration.Services.TeamManagement
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.TeamManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.TeamManagement;
    using System.Collections.Generic;
    using System.Linq;

    public class TeamManagementService : TGRSBaseService, ITeamManagementService
    {
        public IList<TeamInfo> GetAllTeam()
        {
            var criteria = new GetAllTeamsCriteria();
            var result = this.GetData<TeamInfo>(criteria).ToList();

            return result;
        }

        public ICommandResult InsertTeam(InsertTeamCriteria criteria)
        {
            return this.UpdateData(criteria);
        }

        public ICommandResult UpdateTeam(UpdateTeamCriteria criteria)
        {
            return this.UpdateData(criteria);
        }
    }
}
