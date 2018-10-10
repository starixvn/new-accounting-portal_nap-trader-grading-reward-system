// -----------------------------------------------------------------------
// <copyright file="GetBettypePerformanceCriteria .cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Aaron" date="2016.08.16">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSReports.Criteria.SportPerformance
{
    using Fanex.Data.Repository;
    using System;

    public class GetBettypePerformanceCriteria : CriteriaBase
    {
        public int ReportType { get; set; }

        public int SportId { get; set; }

        public int LeagueId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int TraderId { get; set; } = -1;

        public override string GetSettingKey()
        {
            return "TGRS_OS_Rpt_SportPerformance_League_Bettype";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}