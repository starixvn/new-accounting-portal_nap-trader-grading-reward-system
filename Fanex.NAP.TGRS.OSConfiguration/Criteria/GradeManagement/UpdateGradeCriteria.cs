// -----------------------------------------------------------------------
// <copyright file="UpdateGradeCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Aaron" date="2016.07.29">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.GradeManagement
{
    using Fanex.NAP.Framework.Data;
    using Fanex.NAP.TGRS.OSConfiguration.Services.Utility;

    public class UpdateGradeCriteria : CriteriaBase
    {
        public int GradeId { get; set; }

        public string GradeName { get; set; }

        public int UserId
        {
            get
            {
                return SessionUtility.GetCreatorId();
            }
        }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_GradeUpdate";
        }

        public override bool IsValid()
        {
            return GradeId > 0 && !string.IsNullOrEmpty(GradeName);
        }
    }
}