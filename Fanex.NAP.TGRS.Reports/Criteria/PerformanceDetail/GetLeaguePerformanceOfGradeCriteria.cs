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
        [SpParam(Ignored = true)]
        public bool IsLive { get; set; }

        public Int16 Market
        {
            get
            {
                if (this.IsLive)
                {
                    return 1;
                }

                return 0;
            }
        }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public byte Grade { get; set; }

        public string BetTypes { get; set; }

        public bool IsExcludeLeagues { get; set; }

        public string LeagueGroupIds { get; set; }

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