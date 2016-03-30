using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Fanex.NAP.Framework.Data;

namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail
{
    public class GetLeagueDetailTeamCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public short TeamId { get; set; }

        public string Bettypes { get; set; }


        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_PerformanceDetail_Team_League";
        }
    }
}
