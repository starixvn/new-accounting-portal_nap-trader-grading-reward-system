// -----------------------------------------------------------------------
// <copyright file="UpdateGradeCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.12">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Criteria.GradeManagement
{
    using System;
    using Fanex.Data.Repository;

    /// <summary>
    /// Update grade criteria.
    /// </summary>
    public class UpdateGradeCriteria : CriteriaBase
    {
        public int GradeId { get; set; }

        public string GradeName { get; set; }

        public string Description { get; set; }

        public int UserId { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        /// <summary>
        /// Gets Setting Key.
        /// </summary>
        /// <returns>Setting key of the criteria.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_Grade_Update";
        }

        /// <summary>
        /// Checks validation of the criteria.
        /// </summary>
        /// <returns>Whether or not the criteria is valid.</returns>
        public override bool IsValid()
        {
            return true;
        }
    }
}
