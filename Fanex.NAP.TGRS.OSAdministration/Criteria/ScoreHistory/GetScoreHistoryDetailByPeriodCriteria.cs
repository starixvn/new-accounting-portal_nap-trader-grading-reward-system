// --------------------------------------------------------------------------
// <copyright file="GetScoreHistoryDetailByPeriodCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016.8.25">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSAdministration.Criteria.ScoreHistory
{
    using Fanex.NAP.Framework.Data;
    using System;

    public class GetScoreHistoryDetailByPeriodCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_ScoreHistoryGetByPeriod";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
