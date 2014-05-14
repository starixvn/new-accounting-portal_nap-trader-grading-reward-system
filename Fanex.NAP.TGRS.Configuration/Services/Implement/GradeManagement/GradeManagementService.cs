// -----------------------------------------------------------------------
// <copyright file="GradeManagementService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// <history>
//   <change who="Ken.Nguyen" date="2014.5.12">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Services.Implement.GradeManagement
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Configuration.Criteria.GradeManagement;
    using Fanex.NAP.TGRS.Configuration.Models.GradeManagement;
    using Fanex.NAP.TGRS.Configuration.Services.Interface.GradeManagement;
    using Fanex.NAP.TGRS.Configuration.ViewModel.GradeManagement;
    using Fanex.NAP.TGRS.Core.BaseClasses;

    /// <summary>
    /// Grade Management Service.
    /// </summary>
    public class GradeManagementService : TGRSBaseService, IGradeManagementService
    {
        /// <summary>
        /// Get all Grade.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of Grade information.</returns>
        public GradeInfoList GetAllGrade(GetAllGradesCriteria criteria)
        {
            GradeInfoList result = null;

            var rawData = this.GetData<GradeInfo>(criteria);

            if (rawData != null)
            {
                result = new GradeInfoList();

                foreach (GradeInfo grade in rawData)
                {
                    var gradeInfoItem = new GradeInfoItem(grade);

                    result.Add(gradeInfoItem);
                }
            }

            return result;
        }

        /// <summary>
        /// Insert new Grade.
        /// </summary>
        /// <param name="criteria">The criteria that are used to insert data.</param>
        /// <returns>Result of insert.</returns>
        public ICommandResult InsertGrade(InsertGradeCriteria criteria)
        {
            return this.UpdateData(criteria);
        }

        /// <summary>
        /// Update new Grade.
        /// </summary>
        /// <param name="criteria">The criteria that are used to update data.</param>
        /// <returns>Result of update.</returns>
        public ICommandResult UpdateGrade(UpdateGradeCriteria criteria)
        {
            return this.UpdateData(criteria);
        }
    }
}
