// -----------------------------------------------------------------------
// <copyright file="GradeManagementService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Aaron" date="2016.07.29">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSConfiguration.Services.GradeManagement
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.GradeManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.GradeManagement;
    using System.Collections.Generic;
    using System.Linq;

    public class GradeManagementService : TGRSBaseService, IGradeManagementService
    {
        public IList<GradeInfo> GetAllGrade()
        {
            var criteria = new GetAllGradesCriteria();
            var result = this.GetData<GradeInfo>(criteria).ToList();

            return result;
        }

        public ICommandResult InsertGrade(InsertGradeCriteria criteria)
        {
            return this.UpdateData(criteria);
        }

        public ICommandResult UpdateGrade(UpdateGradeCriteria criteria)
        {
            return this.UpdateData(criteria);
        }
    }
}
