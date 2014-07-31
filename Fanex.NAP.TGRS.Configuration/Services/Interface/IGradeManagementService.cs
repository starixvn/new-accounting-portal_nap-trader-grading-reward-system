// -----------------------------------------------------------------------
// <copyright file="IGradeManagementService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.12">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Services.GradeManagement
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Configuration.Criteria.GradeManagement;
    using Fanex.NAP.TGRS.Configuration.ViewModel.GradeManagement;

    public interface IGradeManagementService
    {
        GradeInfoList GetAllGrade(GetAllGradesCriteria criteria);

        ICommandResult InsertGrade(InsertGradeCriteria criteria);

        ICommandResult UpdateGrade(UpdateGradeCriteria criteria);
    }
}
