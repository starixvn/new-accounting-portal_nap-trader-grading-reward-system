// -----------------------------------------------------------------------
// <copyright file="GradeHistoryItem.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.ViewModel.TraderManagement
{
    using System;
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Configuration.Models.TraderManagement;

    /// <summary>
    /// GradeHistory model.
    /// </summary>
    public class GradeHistoryItem
    {
        public GradeHistoryItem(GradeHistory gradeHistory)
        {
            this.Grade = gradeHistory.Grade;
            this.EffectiveDate = gradeHistory.EffectiveDate.ToShortFormatedDate();
        }

        public int Grade { get; set; }

        public string EffectiveDate { get; set; }
    }
}
