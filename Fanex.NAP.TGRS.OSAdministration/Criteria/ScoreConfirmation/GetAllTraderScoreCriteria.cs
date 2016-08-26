// --------------------------------------------------------------------------
// <copyright file="GetAllTraderScoreCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2016.8.26">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSAdministration.Criteria.ScoreConfirmation
{
    using Fanex.NAP.Framework.Data;
    using System;

    public class GetAllTraderScoreCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_Rpt_TraderPerformance";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
