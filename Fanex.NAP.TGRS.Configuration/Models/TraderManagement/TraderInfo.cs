// -----------------------------------------------------------------------
// <copyright file="TraderInfo.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Models.TraderManagement
{
    using System;

    /// <summary>
    /// Trader information model.
    /// </summary>
    public class TraderInfo
    {
        public int CustId { get; set; }

        public string UserName { get; set; }

        public string EmployeeId { get; set; }

        public string TeamName { get; set; }

        public string GradeName { get; set; }

        public DateTime CreatedDate { get; set; }

        public int CreatedBy { get; set; }

        public string CreatedUsername { get; set; }

        public DateTime EffectiveDate { get; set; }
    }
}
