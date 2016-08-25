// --------------------------------------------------------------------------
// <copyright file="GetAllScoreHistoryCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016.8.25">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSAdministration.Criteria.ScoreHistory
{
    using Fanex.NAP.Framework.Data;

    public class GetAllScoreHistoryCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "TGRS_OS_ScoreHistoryGetAll";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
