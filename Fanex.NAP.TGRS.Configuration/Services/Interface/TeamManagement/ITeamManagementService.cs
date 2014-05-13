// -----------------------------------------------------------------------
// <copyright file="ITeamManagementService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.12">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Services.Interface.TeamManagement
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Configuration.Criteria.TeamManagement;
    using Fanex.NAP.TGRS.Configuration.ViewModel.TeamManagement;

    public interface ITeamManagementService
    {
        TeamInfoList GetAllTeam(GetAllTeamsCriteria criteria);

        ICommandResult InsertTeam(InsertTeamCriteria criteria);

        ICommandResult UpdateTeam(UpdateTeamCriteria criteria);
    }
}
