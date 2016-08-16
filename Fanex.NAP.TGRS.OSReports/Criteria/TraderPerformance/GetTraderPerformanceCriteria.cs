using System;
using Fanex.NAP.Framework.Data;

namespace Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformance
{
    public class GetTraderPerformanceCriteria : CriteriaBase
    {
        public string TraderName { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_OS_Rpt_TraderPerformance";
        }
    }
}