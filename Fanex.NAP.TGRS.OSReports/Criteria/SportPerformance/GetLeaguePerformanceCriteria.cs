// -----------------------------------------------------------------------
// <copyright file="GetSportPerformanceCriteria .cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Aaron" date="2016.08.16">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSReports.Criteria.SportPerformance
{
    using Fanex.NAP.Framework.Data;
    using System;

    public class GetLeaguePerformanceCriteria : CriteriaBase
    {
        public int SportId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_Rpt_LeaguePerformance";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}