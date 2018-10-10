// -----------------------------------------------------------------------
// <copyright file="GetAllGradesCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Aaron" date="2016.07.29">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.GradeManagement
{
    using Fanex.Data.Repository;

    public class GetAllGradesCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "TGRS_OS_GradeGetAll";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}