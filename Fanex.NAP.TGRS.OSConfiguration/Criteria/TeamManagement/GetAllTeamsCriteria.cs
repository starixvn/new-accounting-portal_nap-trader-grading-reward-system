// -----------------------------------------------------------------------
// <copyright file="GetAllTeamsCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Aaron" date="2016.07.29">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TeamManagement
{
    using Fanex.NAP.Framework.Data;

    public class GetAllTeamsCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "TGRS_OS_TeamGetAll";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}