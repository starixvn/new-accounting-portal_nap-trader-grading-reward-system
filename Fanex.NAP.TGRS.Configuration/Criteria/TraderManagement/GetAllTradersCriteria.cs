// -----------------------------------------------------------------------
// <copyright file="GetAllTradersCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.12">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Criteria.TraderManagement
{
    using System;
    using Fanex.Data.Repository;

    /// <summary>
    /// Get all Trader.
    /// </summary>
    public class GetAllTradersCriteria : CriteriaBase
    {
        public GetAllTradersCriteria()
        {
            UserName = string.Empty;
            EmployeeId = string.Empty;
            TeamId = 0;
            Grade = 0;
        }

        public string UserName { get; set; }

        public string EmployeeId { get; set; }

        public int TeamId { get; set; }

        public int Grade { get; set; }

        public int Shift { get; set; }

        /// <summary>
        /// Gets Setting Key.
        /// </summary>
        /// <returns>Setting key of the criteria.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_Trader_SelectAll";
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
