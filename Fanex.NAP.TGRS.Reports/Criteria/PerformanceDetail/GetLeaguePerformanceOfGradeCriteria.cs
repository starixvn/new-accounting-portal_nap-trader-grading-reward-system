// --------------------------------------------------------------------------
// <copyright file="GetLeaguePerformanceOfGradeCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016.03.28">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail
{
    using System;
    using Fanex.Data.Repository;

    public class GetLeaguePerformanceOfGradeCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public byte Grade { get; set; }

        public string BetTypes { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_PerformanceDetail_Grade_League";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}