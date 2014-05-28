// -----------------------------------------------------------------------
// <copyright file="UpdateTraderCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.12">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Criteria.TraderManagement
{
    using System;
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// Update Trader criteria.
    /// </summary>
    public class UpdateTraderCriteria : CriteriaBase
    {
        public int CustId { get; set; }

        public int? NewTeamId { get; set; }

        public int? NewGrade { get; set; }

        public DateTime? NewTeamEffectiveDate { get; set; }

        public DateTime? NewGradeEffectiveDate { get; set; }

        public int UserId { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        /// <summary>
        /// Gets Setting Key.
        /// </summary>
        /// <returns>Setting key of the criteria.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_Trader_Update";
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
