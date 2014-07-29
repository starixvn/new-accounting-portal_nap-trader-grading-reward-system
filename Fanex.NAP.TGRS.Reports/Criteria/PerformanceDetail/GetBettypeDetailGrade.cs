// --------------------------------------------------------------------------
// <copyright file="GetBettypeDetailGrade.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.7.28">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail
{
    using System;
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// Getting bet type detail from league detail report.
    /// </summary>
    public class GetBettypeDetailGrade : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public byte Grade { get; set; }

        public int CustId { get; set; }

        public int MatchID { get; set; }

        public string Bettypes { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_DetailGrade_BetType";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}