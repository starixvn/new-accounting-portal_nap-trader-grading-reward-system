// -----------------------------------------------------------------------
// <copyright file="GradeHistory.cs" company="Nexcel Solutions Vietnam">
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
    /// GradeHistory model.
    /// </summary>
    public class GradeHistory
    {
        public int Grade { get; set; }

        public DateTime EffectiveDate { get; set; }
    }
}
