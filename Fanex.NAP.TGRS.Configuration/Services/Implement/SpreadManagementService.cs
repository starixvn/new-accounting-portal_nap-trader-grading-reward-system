// -----------------------------------------------------------------------
// <copyright file="SpreadManagementService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// <history>
//   <change who="Aaron.Cao" date="2016.1.20">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Services.SpreadManagement
{
    using System.Collections.Generic;
    using Core.BaseClasses;
    using Criteria.SpreadManagement;
    using Framework.Command;
    using Models.SpreadManagement;

    public class SpreadManagementService : TGRSBaseService, ISpreadManagementService
    {
        public IEnumerable<SpreadInfo> GetAllSpread(GetAllSpreadCriteria criteria)
        {
            var result = new List<SpreadInfo>();

            return result;
        }

        public ICommandResult UpdateSpread(UpdateSpreadCriteria criteria)
        {
            return UpdateData(criteria);
        }
    }
}
