// -----------------------------------------------------------------------
// <copyright file="ITeamManagementService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Aaron" date="2016.07.29">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSConfiguration.Services.TeamManagement
{
    using Fanex.NAP.Framework.Command;
    using Fanex.Data.Repository;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.TeamManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.TeamManagement;
    using System.Collections.Generic;

    public interface ITeamManagementService
    {
        IList<TeamInfo> GetAllTeam();

        ICommandResult InsertTeam(InsertTeamCriteria criteria);

        ICommandResult UpdateTeam(UpdateTeamCriteria criteria);
    }
}
