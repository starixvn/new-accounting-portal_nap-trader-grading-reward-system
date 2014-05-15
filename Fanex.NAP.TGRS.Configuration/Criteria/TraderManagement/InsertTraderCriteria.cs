// -----------------------------------------------------------------------
// <copyright file="InsertTraderCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.13">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Criteria.TraderManagement
{
    using System;
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// Update Trader criteria.
    /// </summary>
    public class InsertTraderCriteria : CriteriaBase
    {
        public string Username { get; set; }

        public string EmployeeId { get; set; }

        public int TeamId { get; set; }

        public int GradeId { get; set; }

        public int UserId { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        /// <summary>
        /// Gets Setting Key.
        /// </summary>
        /// <returns>Setting key of the criteria.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_Trader_Insert";
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
