// -----------------------------------------------------------------------
// <copyright file="GradeHistoryGeneralItem.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceSummary
{
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;

    /// <summary>
    /// GradeHistory model.
    /// </summary>
    public class GradeHistoryGeneralItem
    {
        public GradeHistoryGeneralItem(GradeHistoryGeneral item)
        {
            this.Grade = item.Grade;
            this.EffectiveDate = item.EffectiveDate.ToShortFormatedDate();
        }

        public int Grade { get; set; }

        public string EffectiveDate { get; set; }
    }
}
