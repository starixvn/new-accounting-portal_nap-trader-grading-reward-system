// -----------------------------------------------------------------------
// <copyright file="IGradeManagementService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Aaron" date="2016.07.29">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSConfiguration.Services.GradeManagement
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.Framework.Data;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.GradeManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.GradeManagement;
    using System.Collections.Generic;

    public interface IGradeManagementService
    {
        IList<GradeInfo> GetAllGrade();

        ICommandResult InsertGrade(InsertGradeCriteria criteria);

        ICommandResult UpdateGrade(UpdateGradeCriteria criteria);
    }
}
