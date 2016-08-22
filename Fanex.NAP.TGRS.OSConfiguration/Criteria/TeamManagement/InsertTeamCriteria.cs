// -----------------------------------------------------------------------
// <copyright file="InsertTeamCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Aaron" date="2016.07.29">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TeamManagement
{
    using Fanex.NAP.Framework.Data;
    using Fanex.NAP.TGRS.OSConfiguration.Services.Utility;

    public class InsertTeamCriteria : CriteriaBase
    {
        public string TeamName { get; set; }

        public int UserId { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_TeamInsert";
        }

        public override bool IsValid()
        {
            return !string.IsNullOrEmpty(TeamName);
        }
    }
}