// -----------------------------------------------------------------------
// <copyright file="GradeInfoItem.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.12">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.ViewModel.GradeManagement
{
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Configuration.Models.GradeManagement;

    /// <summary>
    /// Grade info view model.
    /// </summary>
    public class GradeInfoItem
    {
        public GradeInfoItem(GradeInfo gradeInfo)
        {
            this.GradeId = gradeInfo.GradeId;
            this.GradeName = gradeInfo.GradeName;
            this.Description = gradeInfo.Description;
            this.TraderCount = gradeInfo.TraderCount;
            this.CreatedDate = gradeInfo.CreatedDate.ToFullFormatedDate();
            this.CreatedBy = gradeInfo.CreatedBy;
            this.CreatedUsername = gradeInfo.CreatedUsername;
        }

        public int GradeId { get; set; }

        public string GradeName { get; set; }

        public string Description { get; set; }

        public int TraderCount { get; set; }

        public string CreatedDate { get; set; }

        public int CreatedBy { get; set; }

        public string CreatedUsername { get; set; }
    }
}
