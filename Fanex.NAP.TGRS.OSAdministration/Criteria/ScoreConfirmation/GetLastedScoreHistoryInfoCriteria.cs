// --------------------------------------------------------------------------
// <copyright file="GetLastedScoreHistoryInfoCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2016.8.26">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSAdministration.Criteria.ScoreConfirmation
{
    using Fanex.NAP.Framework.Data;

    public class GetLastedScoreHistoryInfoCriteria : CriteriaBase
    {

        public override string GetSettingKey()
        {
            return "TGRS_OS_LastestScoreHistoryGet";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
