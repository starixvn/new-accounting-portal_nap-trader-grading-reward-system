// --------------------------------------------------------------------------
// <copyright file="ISpreadManagementService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016.1.20">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Services.SpreadManagement
{
    using System.Collections.Generic;
    using Criteria.SpreadManagement;
    using Fanex.NAP.TGRS.Configuration.Models.SpreadManagement;
    using Framework.Command;
    using ViewModel.SpreadManagement;

    public interface ISpreadManagementService
    {
        SpreadInfoList GetAllSpread(GetAllSpreadCriteria criteria);

        ICommandResult UpdateSingleSpread(UpdateSingleSpreadCriteria criteria);

        ICommandResult DeleteSpread(DeleteSpreadCriteria criteria);

        void ExportSpreadList(GetAllSpreadCriteria criteria, string templatePath);

        ICommandResult UpdateSpread(UpdateSpreadCriteria criteria);

        IEnumerable<Bettype> GetBettypeIdsList();

        IEnumerable<League> GetLeagueIdsList();
    }
}