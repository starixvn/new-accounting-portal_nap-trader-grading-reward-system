using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Fanex.Data.Repository;

namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail
{
    public class GetTraderPerformanceOfLeagueTeam : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public short TeamId { get; set; }

        public int LeagueId { get; set; }

        public string Bettypes { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_PerformanceDetail_Team_League_Trader";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
