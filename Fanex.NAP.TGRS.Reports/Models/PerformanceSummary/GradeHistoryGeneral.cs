// -----------------------------------------------------------------------
// <copyright file="GradeHistoryGeneral.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Models.PerformanceSummary
{
    using System;
    using System.Data;

    /// <summary>
    /// GradeHistory model.
    /// </summary>
    public class GradeHistoryGeneral
    {
        public GradeHistoryGeneral()
        {
            this.Grade = 0;
            this.EffectiveDate = new DateTime();
        }

        public GradeHistoryGeneral(DataRow row)
        {
            this.Grade = Convert.ToInt32(row["Grade"]);
            this.EffectiveDate = Convert.ToDateTime(row["EffectiveDate"]);
        }

        public int Grade { get; set; }

        public DateTime EffectiveDate { get; set; }
    }
}
